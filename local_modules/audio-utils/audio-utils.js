// @ts-check
class _AudioUtils extends EventTarget {
    constructor() {
        super();
        this._notes = [];

        this.playEffectNote = this.playEffectNote.bind(this);
        this.stopNote = this.stopNote.bind(this);
        this.convertBlobToAudioBuffer = this.convertBlobToAudioBuffer.bind(this);
        this.loadSample = this.loadSample.bind(this);
        this.playSample = this.playSample.bind(this);
    }

    get ctx() {
        if(!this._audioCtx) {
          this._audioCtx = new (AudioContext || webkitAudioContext)();
        }

        return this._audioCtx;
    }

    playEffectNote(sample, rate, note, velocity) {
        if(velocity === undefined) velocity = 0x7F;
        const aCtx = this.ctx;
        const src = aCtx.createBufferSource();
        if(rate) {
          src.playbackRate.value = rate;
        }
        src.buffer = sample;
    
        const gainNode = aCtx.createGain();
        gainNode.gain.value = velocity / 0x7F; 
    
        src.connect(gainNode);
        gainNode.connect(aCtx.destination);
    
        src.start(0);
        this._notes[note] = src;
    }
    
    stopNote(note) {
        let src = this._notes[note];
        if(src) {
            src.stop();
        }
    }
    
    async convertBlobToAudioBuffer(blob) {
        console.log(typeof blob);
        const aCtx = this.ctx;
        var reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onload = () => {
                aCtx.decodeAudioData(reader.result, buffer => {
                    resolve(buffer);
                });
            };
            reader.readAsArrayBuffer(blob);
        });
    }

    async loadSample(url) {
        const aCtx = this.ctx;
    
        return new Promise((resolve, reject) => {
            fetch(url)
            .then(response => response.arrayBuffer())
            .then((data) => {
                aCtx.decodeAudioData(data, buffer => {
                    resolve(buffer);
                });
            });
        });
    }

    playSample(sample) {
        const aCtx = this.ctx;
        const src = aCtx.createBufferSource();
        src.buffer = sample;
        src.connect(aCtx.destination);
        src.start(0);
      }
    
    
}

const _instance = new _AudioUtils();

export const AudioUtils = _instance;