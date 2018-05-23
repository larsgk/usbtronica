// @ts-check
class BLEThingy52 extends EventTarget {
    constructor() {
        super();

        let count = 0;
        setInterval(() => { this.emit({message:"heartbeat", count:count++})}, 1000);

        this._devices = new Map();
    }

    emit(msg) {
        this.dispatchEvent(new CustomEvent('message', {
            detail: msg
        }));
    }

    static getCapabilities() {
        return [
            'accelerometer',
            'thermometer'
        ];
    }

    async _scan() {
        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: ['ef680100-9b35-4933-9b10-52ffa9740042'] }],
                optionalServices: [
                    "ef680200-9b35-4933-9b10-52ffa9740042",
                    "ef680300-9b35-4933-9b10-52ffa9740042",
                    "ef680400-9b35-4933-9b10-52ffa9740042",
                    "ef680500-9b35-4933-9b10-52ffa9740042"
                ]
            });

            if(this._devices.has(device.id)) {
                console.log("Device already connected!");
                return;
            }
    
            //this._attachDevice(device);
            this._devices.set(device.id, device);
            console.log(this._devices);
        
            this.dispatchEvent(new CustomEvent('connect', {detail: {type: 'ble', device: device}}));

        } catch (err) {
            console.log(err); // No device was selected.
        }
    }
}

const _instance = new BLEThingy52();

export const BLEThingy52Manager = _instance;
