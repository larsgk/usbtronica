// @ts-check


import {BaseControl} from './base-control.js'

export class DummyControl extends BaseControl {
    constructor() {
        super('DummyControl');
        
        this._runNextCmd = this._runNextCmd.bind(this);

        this._deviceId = 'Dummy1';

        this._nextCmd = 0;

        this._cmds = [
            {cmd: () => { this.emitConnected(this._deviceId)}, t: 1000},
            {cmd: () => { this.emitMessage(this._deviceId, "Much Foo...")}, t: 1000},
            {cmd: () => { this.emitMessage(this._deviceId, "Such Bar...")}, t: 1000},
            {cmd: () => { this.emitMessage(this._deviceId, "")}, t: 1000},
            {cmd: () => { this.emitDisconnected(this._deviceId)}, t: 2000}
        ]


        window.setTimeout(() => {this._runNextCmd()}, 0);
    }

    _runNextCmd() {
        const item = this._cmds[this._nextCmd];
        this._nextCmd = ++this._nextCmd % this._cmds.length;
        item.cmd();
        
        window.setTimeout(this._runNextCmd, item.t);
    }


}
