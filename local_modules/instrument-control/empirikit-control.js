// @ts-check

// Input from empiriKit motion
// Sensors: 3D accel, touch bar
// Output (MIDI mapped):
//   4 axis of: -1 to 1 variable output
// Mapped (for each)
//   variables to quantified midi (1 axis => note around 60, 1 axis => on/off)

import {BaseControl} from './base-control.js'

export class EmpiriKitControl extends BaseControl {
    constructor() {
        super('EmpiriKitControl');
        window.setTimeout(() => {this.initialize()}, 0);
    }

    initialize() {

    }    
}
