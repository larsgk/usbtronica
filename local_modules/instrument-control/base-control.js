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
        if(this.devices.includes(deviceId)) {
            throw `Device ${deviceId} on ${this._controllerType} already connected!`;
        }
        this.devices.push(deviceId);
        this.dispatchEvent(new CustomEvent('connect', {detail: {type: this._controllerType, device: deviceId}}));
    }

    emitDisconnected(deviceId) {
        const idx = this.devices.indexOf(deviceId);
        if(idx === -1) {
            throw `Device ${deviceId} doesn't exist on ${this._controllerType}!`;
        }
        this.devices.splice(idx,1);
        this.dispatchEvent(new CustomEvent('disconnect', {detail: {type: this._controllerType, device: deviceId}}));
    }

    emitControlEvent(deviceId, data) {
        this.dispatchEvent(new CustomEvent('midi-event', {detail: {type: this._controllerType, device: deviceId, data: data}}));
    }

    emitMessage(deviceId, message) {
        this.currentMessage = message;
        this.dispatchEvent(new CustomEvent('message', {detail: {type: this._controllerType, device: deviceId, message: message}}));
    }
}