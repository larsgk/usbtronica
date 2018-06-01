// @ts-check

// The base class containing common functionality (EventTarget, connect/disconnect, etc.)

export class BaseControl extends EventTarget {
    constructor(controllerType) {
        super();
        this._controllerType = controllerType;
        this.devices = [];

        this.MAX_VELOCITY = 0x7F;
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