// @ts-check

// Input from MIDI controller
// Output:
//   MIDI as received

import {BaseControl} from './base-control.js'

export class WebMIDIControl extends BaseControl {
    constructor() {
        super('WebMIDIControl');
        window.setTimeout(() => {this.initialize()}, 0);
    }

    initialize() {

    }    
}
