// @ts-check
import {html, LitElement} from '../modules/lit-html-element/lit-element.js';
import {repeat} from '../modules/lit-html/lib/repeat.js';
// import {getBLEThingy52} from './ble-thingy52.js';
import {MatButton} from '../local_modules/mat-button/mat-button.js';
import {SampleVisualizer} from '../local_modules/sample-visualizer/sample-visualizer.js';

import {AudioUtils} from '../local_modules/audio-utils/audio-utils.js';

import {Controllers} from '../local_modules/instrument-control/instrument-control.js';
import { MIDI_MSG_TYPE_NAME, MIDI_MSG_TYPE } from '../local_modules/instrument-control/defs.js';
import { ControllerSettings } from '../local_modules/controller-settings/controller-settings.js';


export class MainApp extends LitElement {

  constructor() {
    super();
    this._devices = [];

    this._notes = [];

    this._onTemperatureChange = this._onTemperatureChange.bind(this);
    this._onAccelChange = this._onAccelChange.bind(this);
    this._onButtonChange = this._onButtonChange.bind(this);
    this._loadSound = this._loadSound.bind(this);
    this._recordToggle = this._recordToggle.bind(this);
    this._playRecording = this._playRecording.bind(this);

    this.playEffectNote = this.playEffectNote.bind(this);
    this.stopNote = this.stopNote.bind(this);

    // getBLEThingy52().addEventListener('message', (msg) => { console.log(msg.detail) });
    // getBLEThingy52().addEventListener('connect', this._handleConnect.bind(this));

    const toneDiff = Math.pow(2, 1/12);

    for(let [type, controller] of Controllers) {
      console.log('Controller registered:', type);
      controller.addEventListener('connect', (e) => console.log('connect', e.detail));
      controller.addEventListener('midi-event', (e) => {
        const msg = e.detail.data;
        console.log('midi-event', MIDI_MSG_TYPE_NAME[msg.type], msg);
        
        if(msg.type === MIDI_MSG_TYPE.NOTE_ON) {
          this.playEffectNote(Math.pow(toneDiff, msg.note-60), msg.note);
        } else if(msg.type === MIDI_MSG_TYPE.NOTE_OFF) {
          this.stopNote(msg.note);
        }
      });
    }

    requestAnimationFrame(this.initialize.bind(this));
  }

  initialize() {
    //this._initRecording();

    this._recording = this.$('recording');
  }

  _initRecording() {
    if (navigator.getUserMedia) {
      let constraints = { audio: true, video: false };
      let chunks = [];

      let onSuccess = stream => {
        this.mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'});

        this._visualize(stream);

        this.mediaRecorder.onstop = (e) => {
          var blob = new Blob(chunks, { 'type' : 'audio/webm' });
          chunks = [];

          this._convertSampleBlob(blob);
          this.isRecording = false;
          // debounce a bit ;)
          // setTimeout(() => {
          //   this.$.record.classList.remove('recording');
          //   this.$.record.disabled = false;
          // }, 1000);
        }
      
        this.mediaRecorder.ondataavailable = (e) => {
          console.log(e.data);
          chunks.push(e.data);
        }
      }

      let onError = err => {
        console.log(err);
      }

      navigator.getUserMedia(constraints, onSuccess, onError);
    } else {
      console.log('getUserMedia is not supported!');
    }
  }

  _recordToggle() {
    console.log("_recordToggle", this.isRecording, this.mediaRecorder);
    if(this.mediaRecorder) {
      if(this.isRecording) {
        this.mediaRecorder.stop();
      } else {
        this.mediaRecorder.start();
        this.isRecording = true;
      }
    }
  }

  _onMIDIMessage(data) {
    const toneDiff = Math.pow(2, 1/12);
    console.log(data);
    switch(data[0]) {
    case 144:
        if(data[2] > 0) {
            this.playEffectNote('sample',Math.pow(toneDiff, data[1]-60), data[1]);
        } else {
            this.stopNote(data[1]);
        }
        break;
    // case 0xE0: // 224 = pitch bend
    //     WindMIDIService._fireEvent({
    //         type: "pitch",
    //         value: data[1] + (data[2] << 7)
    //     });
    //     break;
    // case 0xD0: // 208 = pressure/after-touch
    //     WindMIDIService._fireEvent({
    //         type: "pressure",
    //         value: data[1]
    //     });
    //     break;

    }
  }

  playEffectNote(rate, note) {
    const aCtx = AudioUtils.ctx;
    const src = aCtx.createBufferSource();
    if(rate) {
      src.playbackRate.value = rate;
    }
    src.buffer = this.lastRecording;
    src.connect(aCtx.destination);
    src.start(0);
    this._notes[note] = src;
  }

  stopNote(note) {
      let src = this._notes[note];
      if(src) {
          src.stop();
      }
  }

  get lastRecording() {
    return this._lastRecording;
  }

  set lastRecording(val) {
    this._lastRecording = val;
    this.$('lastRec').data = val;
  }

  _convertSampleBlob(blob) {
    const aCtx = AudioUtils.ctx;
    var reader = new FileReader();
    reader.onload = () => {
        console.log(reader.result);
        aCtx.decodeAudioData(reader.result, buffer => {
            this.lastRecording = buffer;
            console.log(buffer);
        });
    };
    reader.readAsArrayBuffer(blob);
  }

  _visualize(stream) {
    const aCtx = AudioUtils.ctx;

    let source = aCtx.createMediaStreamSource(stream);

    let analyser = aCtx.createAnalyser();
    analyser.fftSize = 2048;
    let dataArray = new Float32Array(analyser.fftSize);

    this._recording.data = dataArray;

    source.connect(analyser);

    let draw = () => {
      requestAnimationFrame(draw);
      analyser.getFloatTimeDomainData(dataArray);
      this._recording.data = dataArray;
    }

    draw();
  }

  _handleConnect(evt) {
    const msg = evt.detail;

    if(msg.type === 'ble') {
      this._attachDevice(msg.device);
    }
  }

  _renderDeviceInfo() {
    if (!this._devices.length) {
      return "N/A";
    }

    return html`
      ${this._devices.map(d => {
        const dataArr = Object.keys(d.data);
        return html`
          ${d.device.name}
          <mat-button class="mini-button" on-click='${e => this._detachDevice(d.device)}'>
            DISCONNECT
          </mat-button>:
          <br>
          <ul>
            ${
              repeat(dataArr, (i) => i, (i, idx) => {
                let value = d.data[i];
                if (typeof(value) === "object") {
                  value = JSON.stringify(value);
                }
                return html`<li>${i}: ${value}</li>`
              })
            }
          </ul>
        `
      })}
    `;
  }

  render() {
    return html`
      <style>
        :host {
          font-family: Roboto, Arial;
        }
        .mini-button {
          font-size: 8pt;
        }
        .title {
          font-weight: bold;
        }

        .aaa {
          --line-color:blue;
          --background-color:yellow;
          width:350px;
          height:200px;
        }

        .bbb {
          --line-color:red;
          --background-color:green;
          width: 50vw;
          height: 200px;
        }

        .ccc {
          width: 100%;
          height: 150px;
        }

      </style>
      <h1>usBTronica</h1>
      <br>
      <mat-button on-click='${ _ => this._enableAudio()}'>Start audio</mat-button>
      <controller-settings></controller-settings>
      <sample-visualizer id='recording' class="ccc" on-click='${ this._recordToggle }}'></sample-visualizer>
      <sample-visualizer class="aaa" on-click='${ this._loadSound }'>AAA</sample-visualizer>
      <sample-visualizer id="lastRec" on-click='${ this._playRecording }'class="bbb"></sample-visualizer>
      <sample-visualizer class="ccc" on-click='${ this._loadSound }'>CCC</sample-visualizer><br>
      <mat-button on-click='${ _ => this._scan()}'>CONNECT <b>THINGY:52</b></mat-button>
      <br><br>
      <p>
        <h2 class="title">Devices:</h2><br>
        ${this._renderDeviceInfo()}
      </p>
    `;
  }

  _enableAudio() {
    const aCtx = AudioUtils.ctx;
    this._initRecording();
    // this could just be part of a splash screen or other natural element the user clicks anyway
  }

  _loadSound(evt) {
    this.loadEffect('./assets/audio/test.ogg', evt.target);
  }

  _playRecording() {
    const aCtx = AudioUtils.ctx;
    const src = aCtx.createBufferSource();
    src.buffer = this.lastRecording;
    src.connect(aCtx.destination);
    src.start(0);
  }

  loadEffect(url, target) {
    const aCtx = AudioUtils.ctx;

    const src = aCtx.createBufferSource();

    fetch(url)
    .then(response => response.arrayBuffer() )
    .then((buffer) => {
      aCtx.decodeAudioData(buffer, decodedData => {
        src.buffer = decodedData;

        target.data = decodedData;

        src.connect(aCtx.destination);
        src.start(0);
      });
    });
  }



  // When the GATT server is disconnected, remove the device from the list
  _deviceDisconnected(device) {
    console.log('Disconnected', device);
    const idx = this._devices.findIndex(dev => dev.device === device);

    if (idx >= 0) {
      this._devices.splice(idx, 1)
      this.invalidate();
    }
  }

  // Characteristic notification handlers
  _onTemperatureChange(event) {
    const target = event.target;
    const idx = this._devices.findIndex(dev => dev.device === target.service.device);
    if (idx < 0) {
      return;
    }

    const integer = target.value.getUint8(0);
    const decimal = target.value.getUint8(1);

    this._devices[idx].data.temperature = `${integer}.${decimal}°C`;
    this.invalidate();
  }

  _onAccelChange(event) {
    const target = event.target;
    const idx = this._devices.findIndex(dev => dev.device === target.service.device);
    if (idx < 0) {
      return;
    }

    this._devices[idx].data.accel = {
      x: +target.value.getFloat32(0, true).toPrecision(5),
      y: +target.value.getFloat32(4, true).toPrecision(5),
      z: +target.value.getFloat32(8, true).toPrecision(5)
    };

    this.invalidate();
  }

  _onButtonChange(event) {
    const target = event.target;
    const idx = this._devices.findIndex(dev => dev.device === target.service.device);
    if (idx < 0) {
      return;
    }

    const device = this._devices[idx];
    const button = device.data.button = target.value.getUint8(0) === 1;

    // set led color to red or green based on button pressed state
    if (device.led) {
      const hexToRGB = hex => hex.match(/[A-Za-z0-9]{2}/g).map(v => parseInt(v, 16));
      const color = hexToRGB(button ? '#ff0000' : '#00ff00');
      return device.led.writeValue(new Uint8Array([1, ...color]));
    }
  }

  // If successful, adds the Thingy:52 to this._devices array
  async _attachDevice(device) {
    // Check that device is not already connected
    if (this._devices.findIndex(dev => dev.device.id === device.id) >= 0) {
      console.log('Device already connected!');
      return;
    }

    const server = await device.gatt.connect();

    await this._startTemperatureNotifications(server);
    await this._startAccelerometerNotifications(server);
    await this._startButtonClickNotifications(server);

    const led = await this._getLedCharacteristic(server);

    this._devices.push({device, led, data: {}});

    device.ongattserverdisconnected = _ => this._deviceDisconnected(device);

    this.invalidate();
  }

  async _startTemperatureNotifications(server) {
    const service = await server.getPrimaryService('ef680200-9b35-4933-9b10-52ffa9740042');
    const characteristic = await service.getCharacteristic('ef680201-9b35-4933-9b10-52ffa9740042');
    characteristic.addEventListener('characteristicvaluechanged', this._onTemperatureChange);
    return characteristic.startNotifications();
  }

  async _startAccelerometerNotifications(server) {
    const service = await server.getPrimaryService('ef680400-9b35-4933-9b10-52ffa9740042');
    const characteristic = await service.getCharacteristic('ef68040a-9b35-4933-9b10-52ffa9740042');
    characteristic.addEventListener('characteristicvaluechanged', this._onAccelChange);
    return characteristic.startNotifications();
  }

  async _startButtonClickNotifications(server) {
    const service = await server.getPrimaryService('ef680300-9b35-4933-9b10-52ffa9740042');
    const characteristic = await service.getCharacteristic('ef680302-9b35-4933-9b10-52ffa9740042');
    characteristic.addEventListener('characteristicvaluechanged', this._onButtonChange);
    return characteristic.startNotifications();
  }

  async _getLedCharacteristic(server) {
    const service = await server.getPrimaryService('ef680300-9b35-4933-9b10-52ffa9740042');
    return await service.getCharacteristic('ef680301-9b35-4933-9b10-52ffa9740042');
  }

  async _scan() {
    // await getBLEThingy52()._scan();
  }

  _detachDevice(device) {
    device.gatt.disconnect();
    // results in _deviceDisconnected call.
  }
}

customElements.define('main-app', MainApp);