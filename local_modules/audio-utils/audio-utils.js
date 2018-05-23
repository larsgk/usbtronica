// @ts-check
class _AudioUtils extends EventTarget {
    constructor() {
        super();

        this.audioContext = new AudioContext();
    }
}

const _instance = new _AudioUtils();

export const AudioUtils = _instance;