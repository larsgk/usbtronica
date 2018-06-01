// @ts-check

// Input from computer keyboard
// Sensors: keys (on/off)
// Output (MIDI mapped):
//   key on/off => note on/off (fixed volume?) around note 60

import { BaseControl } from './base-control.js'
import { MIDI_MSG_TYPE } from './defs.js';

export class KeyboardControl extends BaseControl {
    constructor() {
        super('KeyboardControl');

        // debug
        //window.setInterval(() => this.emitConnected(`keyboard${Math.floor(10*Math.random())}`), 2000);

        this._channel = 0;  // channels: 1 - 16 (but we zero index ;))

        this._deviceId = 0;  // assuming one computer keyboard present

        this.devices.push(this._deviceId);

        window.setTimeout(() => {this.initialize()}, 0);
    }

    // Special case for the keyboard
    addEventListener(type, listener, options) {
      super.addEventListener(type, listener, options);

      if(type === 'connect') {
        window.setTimeout(() => {this.emitConnected(this._deviceId)}, 0);;
      }
    }

    initialize() {
        const _KEY_NOTE = {
            "KeyQ":    60,
            "Digit2":  61,
            "KeyW":    62,
            "Digit3":  63,
            "KeyE":    64,
            "KeyR":    65,
            "Digit5":  66,
            "KeyT":    67,
            "Digit6":  68,
            "KeyY":    69,
            "Digit7":  70,
            "KeyU":    71,
            "KeyI":    72
          };
  
          // setup key bindings
          document.addEventListener('keydown', evt => {
            const toneDiff = Math.pow(2, 1/12);
            if(!evt.repeat) {
              const note = _KEY_NOTE[evt.code];
              if(note !== undefined) {
                this.emitControlEvent(this._deviceId, {type: MIDI_MSG_TYPE.NOTE_ON, channel: this._channel, note: note, velocity: this.MAX_VELOCITY}); 
              } else {
                console.log('pressed: ', evt.code);
              }
            //   else if(evt.code === 'KeyS') {
            //     if(!this.$.record.disabled)
            //       this._recordToggle();
            //   }
            }
          });
  
          document.addEventListener('keyup', evt => {
            if(!evt.repeat) {
              const note = _KEY_NOTE[evt.code];
              if(note !== undefined) {
                this.emitControlEvent(this._deviceId, {type: MIDI_MSG_TYPE.NOTE_OFF, channel: this._channel, note: note, velocity: this.MAX_VELOCITY}); 
              }
            }
          });
        }    
}