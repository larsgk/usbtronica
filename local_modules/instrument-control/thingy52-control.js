// @ts-check

// Input from Thingy:52
// Sensors (used): 3D accel/gyro, button
// Output (MIDI mapped):
//   3 axis of: -1 to 1 variable output
// Mapped (for each)
//   variables to quantified midi (1 axis => note around 60, 1 axis = volume, button => on/off)

import {BaseControl} from './base-control.js'

export class Thingy52Control extends BaseControl {
    constructor() {
        super('Thingy52Control');
        window.setTimeout(() => {this.initialize()}, 0);
    }

    initialize() {

    }    
}
