// @ts-check

// The base class containing common functionality (EventTarget, connect/disconnect, etc.)

export class BaseControl extends EventTarget {
    constructor(controllerType) {
        super();
        this._controllerType = controllerType;

        this.MAX_VELOCITY = 0x7F;

        this.NOTE_OFF = 0x80;
        this.NOTE_ON = 0x90;
        this.KEY_PRESSURE = 0xA0;
        this.CONTROL_CHANGE = 0xB0;
        this.PROGRAM_CHANGE = 0xC0;
        this.CHANNEL_PRESSURE = 0xD0;
        this.PITCH_BEND_CHANGE = 0xE0;
    }

    get controllerType() {
        return this._controllerType;
    }

    emitConnected(deviceId) {
        this.dispatchEvent(new CustomEvent('connect', {detail: {type: this._controllerType, device: deviceId}}));
    }

    emitDisconnected(deviceId) {
        this.dispatchEvent(new CustomEvent('disconnect', {detail: {type: this._controllerType, device: deviceId}}));
    }

    emitControlEvent(deviceId, data) {
        this.dispatchEvent(new CustomEvent('midi-event', {detail: {type: this._controllerType, device: deviceId, data: data}}));
    }

}