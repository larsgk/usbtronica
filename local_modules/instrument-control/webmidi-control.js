// @ts-check

// Input from MIDI controller
// Output:
//   MIDI as received

import { BaseControl } from './base-control.js'
import { MIDI_MSG_TYPE } from './defs.js';

export class WebMIDIControl extends BaseControl {
    constructor() {
        super('WebMIDIControl');

        this._onMIDIEvent = this._onMIDIEvent.bind(this);

        this._deviceId = 0; // (could be 0 - many)

        window.setTimeout(() => {this.initialize()}, 0);
    }

    initialize() {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess({
                sysex: false
            }).then(midiaccess => {
                this._midiaccess = midiaccess;

                let inputs = this._midiaccess.inputs.values();
                for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
                    console.log('midi input', input.value);
                    input.value.onmidimessage = this._onMIDIEvent;
                }

                this._midiaccess.onstatechange = this._onMIDIStateChange.bind(this);
                
            },
            error => console.error("WebMIDI error: " + error));
        } else {
             console.error("WebMIDI not supported.");
        }

    }

    _onMIDIEvent(evt) {
        this.emitControlEvent(evt.currentTarget.id, this._toEvent(evt.data)); 
    }

    _onMIDIStateChange(event) {
        console.log('midi state change: ', event);
        let port = event.port;
        if(port instanceof MIDIInput) {
            if(port.state === 'connected') {
                port.onmidimessage = this._onMIDIEvent.bind(this);
            }
        }
    }

    _toEvent(msg) {
        let result = {};

        if(msg && msg.length) {
            console.log(msg);
            result.type = msg[0] & 0xf0;
            result.channel = result.type != 0xf0 ? msg[0] & 0x0f : undefined;

            switch(result.type) {
                case MIDI_MSG_TYPE.NOTE_ON:
                case MIDI_MSG_TYPE.NOTE_OFF:
                case MIDI_MSG_TYPE.KEY_PRESSURE:
                    result.note = msg[1];
                    result.velocity = msg[2];
                    break;
                case MIDI_MSG_TYPE.CONTROL_CHANGE:
                    result.control = msg[1];
                    result.value = msg[2];
                    break;
                case MIDI_MSG_TYPE.PITCH_BEND_CHANGE:
                    result.value = (msg[2] << 7) + msg[1];
                default:
                    break;

            }

            // Found in forum: "Yes, a Note On message with a zero velocity is equivalent to a Note Off message.
            // This facilitates "running status" which is why the status byte is not present in the second message. This is standard MIDI.""
            if(result.type === MIDI_MSG_TYPE.NOTE_ON && msg[2] === 0) {
                result.type = MIDI_MSG_TYPE.NOTE_OFF;
            }
            
        }

        return result;
    }

}
