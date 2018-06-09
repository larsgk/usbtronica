// @ts-check

// Input from empiriKit motion
// Sensors: 3D accel, touch bar
// Output (MIDI mapped):
//   4 axis of: -1 to 1 variable output
// Mapped (for each)
//   variables to quantified midi (1 axis => note around 60, 1 axis => on/off)

import {BaseControl} from './base-control.js'

import {MIDI_MSG_TYPE} from './defs.js';

const empiriKitUSBID = {
    VID: 0x1209,
    PID: 0xD017
};

export class EmpiriKitControl extends BaseControl {
    constructor() {
        super('EmpiriKitControl');
        // TODO: check for webusb support - bail out and mark an unsupported if not
        // this could even prevent 'instrument-control' from listing it in the first place (TBD)
        this._startDataStream = this._startDataStream.bind(this);
        
        this._note = -1;
        this._touch = 0;
        
        
        // for now, just support one empiriKit device at a time...
        
        
        window.setTimeout(() => {this.initialize()}, 0);
    }
    
    initialize() {
        // Connect to paired devices
        navigator.usb.getDevices()
        .then(availableDevices => {
            if(availableDevices.length){
                this._openDevice(availableDevices[0]); // Begin a session.
            }
            throw "no device available yet";
        })
        .catch(error => { console.log(error); });
        
        navigator.usb.addEventListener('connect', evt => this._openDevice(evt.device));
    }
    
    scan() {
        navigator.usb.requestDevice({ filters: [{vendorId: empiriKitUSBID.VID, productId: empiriKitUSBID.PID}] })
        .then(selectedDevice => {
            this._openDevice(selectedDevice);
        })
        .catch(error => { console.log(error); });
    }
    
    readFromDevice() {
        this.device.transferIn(5, 64).then(result => {
            const decoder = new TextDecoder();
            this.rstring += decoder.decode(result.data);
            // do a quick JSON smoketest (should do better with decoder/streaming)
            const startb = (this.rstring.match(/{/g)||[]).length;
                const endb = (this.rstring.match(/}/g)||[]).length;
                if(startb > 0 && startb === endb) {
                    try {
                        const msg = JSON.parse(this.rstring);
                        this._handleMessage(msg);
                        //   this.dispatchEvent(new CustomEvent('ek-event', {detail:msg}), {bubbles: true});
                    } catch(e) {
                        console.log("NOT JSON:",this.rstring);
                    }
                    this.rstring = "";
                }
                this.readFromDevice();
            })
            .catch(error => { 
                console.log(error);
                this.emitMessage(this.device.serialNumber, "");
                this.emitDisconnected(this.device.serialNumber);
                this.device = null;
            });
        }
        
        sendCMD(string) {
            console.log(`Sending to serial: [${string}]\n`);
            let data = new TextEncoder('utf-8').encode(string);
            console.log(data);
            if (this.device) {
                this.device.transferOut(5, data);
            }
        };
        
        _startDataStream() {
            this.sendCMD('{"STRACC":1}');
            this.sendCMD('{"STRTCH":1}');
        }
        
        _handleMessage(data) {
            if(data.datatype === "StreamData") {
                this.tick = data.tick;
                let accelData = data.accelerometerdata;
                let touchData = data.touchsensordata;
                
                if(accelData !== undefined) {
                    const accelFactor = 9.82 / (1<<14);  // TBD: Maybe we can adjust it in the firmware
                    // TODO: value will be used later for display...
                    const accel = {
                        x: +accelData[0] * accelFactor,
                        y: +accelData[1] * accelFactor,
                        z: +accelData[2] * accelFactor
                    };
                    
                    const note = Math.round(60 - accel.x);
                    
                    if(this._note != note) {
                        this._note = note;
                        this.emitMessage(this.device.serialNumber, `note# ${this._note}`);
                    }
                }
                
                if(touchData !== undefined) {
                    //this.pgel.addValue('black',((touch-20)<<14) * 0.1);

                    const TOUCH_MAX = 40;  // TBD
                    
                    // do some note on/off XOR logic...
                    if( (this._touch === 0 && touchData !== 0) || (this._touch !== 0 && touchData === 0) ){
                        if(touchData !== 0) {
                            if(this._note) {
                                this.emitControlEvent(this.device.serialNumber, {
                                    type: MIDI_MSG_TYPE.NOTE_ON,
                                    channel: 0,
                                    note: this._note,
                                    velocity: Math.floor((touchData * this.MAX_VELOCITY) / TOUCH_MAX)});
                                this._lastNote = this._note;
                            }
                        } else {
                            if(this._lastNote) {
                                this.emitControlEvent(this.device.serialNumber, {type: MIDI_MSG_TYPE.NOTE_OFF, channel: 0, note: this._lastNote, velocity: this.MAX_VELOCITY});
                            }
                        }

                        this._touch = touchData;
                    }
                }
            } else if(data.datatype === "HardwareInfo") {
                this.capabilities = data.capabilities;
                this.uid = data.uid;
                this.version = data.version;
            } else {
                console.log(data);
            }
        }
        
        _openDevice(device) {
            device.open()
            .then(_ => device.selectConfiguration(1))
            .then(_ => device.claimInterface(2))
            .then(_ => device.controlTransferOut({
                requestType: 'class',
                recipient: 'interface',
                request: 0x22,
                value: 0x01,
                index: 0x02})) // Ready to receive data
                .then(_ => { 
                    this.device = device;
                    // init the devce (get HW info, etc)
                    // TODO: Multi device support - could need proper serial numbers in firmware
                    
                    this.emitConnected(this.device.serialNumber);
                    
                    setTimeout(this._startDataStream, 500);
                    
                    this.readFromDevice(); 
                }) // Waiting for 64 bytes of data from endpoint #5.
                .catch(error => { console.log(error); });
            }
            
            
        }
        