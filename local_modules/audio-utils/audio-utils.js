// @ts-check
class _AudioUtils extends EventTarget {
    constructor() {
        super();
    }

    get ctx() {
        if(!this._audioCtx) {
          this._audioCtx = new (AudioContext || webkitAudioContext)();
        }

        return this._audioCtx;
    }
}

const _instance = new _AudioUtils();

export const AudioUtils = _instance;