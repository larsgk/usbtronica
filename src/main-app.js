// @ts-check
import {html, LitElement} from '../modules/lit-html-element/lit-element.js';
import {repeat} from '../modules/lit-html/lib/repeat.js';
import {MatButton} from '../local_modules/mat-button/mat-button.js';
import {SampleVisualizer} from '../local_modules/sample-visualizer/sample-visualizer.js';

import {AudioUtils} from '../local_modules/audio-utils/audio-utils.js';

import {Controllers} from '../local_modules/instrument-control/instrument-control.js';
import { MIDI_MSG_TYPE_NAME, MIDI_MSG_TYPE } from '../local_modules/instrument-control/defs.js';
import { ControllerSettings } from '../local_modules/controller-settings/controller-settings.js';


export class MainApp extends LitElement {

  constructor() {
    super();
    this._devices = [];
    this._notes = [];

    // for dev - will be moved to respective components...
    this._doScanForEmpiriKit = this._doScanForEmpiriKit.bind(this);
    this._doScanForThingy52 = this._doScanForThingy52.bind(this);


    this._loadSound = this._loadSound.bind(this);

    this._loadSound = this._loadSound.bind(this);
    this._recordToggle = this._recordToggle.bind(this);
    this._playRecording = this._playRecording.bind(this);

    this.playEffectNote = this.playEffectNote.bind(this);
    this.stopNote = this.stopNote.bind(this);

    // To emulate an instrument playing with 1/2 tone differences, we need this factor on the playback rate between each key:
    const toneDiff = Math.pow(2, 1/12);

    for(let [type, controller] of Controllers) {
      console.log('Controller registered:', type);
      controller.addEventListener('connect', (e) => console.log('connect', e.detail));
      controller.addEventListener('disconnect', (e) => console.log('disconnect', e.detail));
      controller.addEventListener('midi-event', (e) => {
        const msg = e.detail.data;
        console.log('midi-event', MIDI_MSG_TYPE_NAME[msg.type], msg);
        
        if(msg.type === MIDI_MSG_TYPE.NOTE_ON) {
          this.playEffectNote(Math.pow(toneDiff, msg.note-60), msg.note);
        } else if(msg.type === MIDI_MSG_TYPE.NOTE_OFF) {
          this.stopNote(msg.note);
        }
      });
    }

    requestAnimationFrame(this.initialize.bind(this));
  }

  static get properties() {
    return {
      isRecording: {
        type: Boolean
      }
    }
  }

  initialize() {
    //this._initRecording();

    this._recording = this.$('recording');
  }

  _initRecording() {
    if (navigator.getUserMedia) {
      let constraints = { audio: true, video: false };
      let chunks = [];

      let onSuccess = stream => {
        this.mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'});

        this._visualize(stream);

        this.mediaRecorder.onstop = (e) => {
          var blob = new Blob(chunks, { 'type' : 'audio/webm' });
          chunks = [];

          this._convertSampleBlob(blob);
          this.isRecording = false;
        }
      
        this.mediaRecorder.ondataavailable = (e) => {
          console.log(e.data);
          chunks.push(e.data);
        }
      }

      let onError = err => {
        console.log(err);
      }

      navigator.getUserMedia(constraints, onSuccess, onError);
    } else {
      console.log('getUserMedia is not supported!');
    }
  }

  _recordToggle() {
    console.log("_recordToggle", this.isRecording, this.mediaRecorder);
    if(this.mediaRecorder) {
      if(this.isRecording) {
        this.mediaRecorder.stop();
      } else {
        this.mediaRecorder.start();
        this.isRecording = true;
      }
    }
  }

  playEffectNote(rate, note, velocity) {
    if(velocity === undefined) velocity = 0x7F;
    const aCtx = AudioUtils.ctx;
    const src = aCtx.createBufferSource();
    if(rate) {
      src.playbackRate.value = rate;
    }
    src.buffer = this.lastRecording;

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

  get lastRecording() {
    return this._lastRecording;
  }

  set lastRecording(val) {
    this._lastRecording = val;
    this.$('lastRec').data = val;
  }

  _convertSampleBlob(blob) {
    console.log(typeof blob);
    const aCtx = AudioUtils.ctx;
    var reader = new FileReader();
    reader.onload = () => {
        console.log(reader.result);
        aCtx.decodeAudioData(reader.result, buffer => {
            this.lastRecording = buffer;
            console.log(buffer);
        });
    };
    reader.readAsArrayBuffer(blob);
  }

  _visualize(stream) {
    const aCtx = AudioUtils.ctx;

    let source = aCtx.createMediaStreamSource(stream);

    let analyser = aCtx.createAnalyser();
    analyser.fftSize = 2048;
    let dataArray = new Float32Array(analyser.fftSize);

    this._recording.data = dataArray;

    source.connect(analyser);

    let draw = () => {
      requestAnimationFrame(draw);
      analyser.getFloatTimeDomainData(dataArray);
      this._recording.data = dataArray;
    }

    draw();
  }

  render() {
    return html`
      <style>
        @font-face {
          font-family: Bitwise;
          src: url('./bitwise.woff2');
        }

        :host {
          font-family: Bitwise, Arial;
          color: #4a508e;
        }

        .mini-button {
          font-size: 8pt;
        }
        .title {
          font-weight: bold;
        }

        sample-visualizer {
          height: 100px;
          width: 100%;
          max-width: 100%;
        }

        .xlive {
          --line-color:#bf393e;
          --background-color:#d99449;
        }

        .live {
          --line-color:#20ff20;
          --background-color:#001000;
        }

        .flex-container {
          display: flex;
          height: 100%;
          background-color: #d99449;
        }

        .content {
          margin: auto;
          position: relative;
          width: 95%;
          max-width: 700px;
        }

        .col {
          display: flex;
          flex-direction: column;
        }

        .row {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }

        mat-button {
          flex-grow: 1;
        }

      </style>
      <div class="flex-container">
        <div class="content">
          <div class="col">
            <h1>usBTronica</h1>
            <div class="row">
              <mat-button on-click='${ _ => this._enableAudio()}'>Start audio</mat-button>
              <mat-button id="btnrecord" on-click='${ this._recordToggle }'>${this.isRecording ? "Stop recording" : "Start recording"}</mat-button>
              <mat-button on-click='${ this._doScanForEmpiriKit }'>Scan for empiriKit</mat-button>
              <mat-button on-click='${ this._doScanForThingy52 }'>Scan for Thingy52</mat-button>
            </div>
            Live:
            <sample-visualizer id='recording' class='live'></sample-visualizer>
            Recording:
            <sample-visualizer id="lastRec" on-click='${ this._playRecording }'></sample-visualizer>
            <controller-settings></controller-settings>
          </div>
        </div>
      </div>
    `;
  }

  _doScanForEmpiriKit() {
    // empiriKit|MOTION uses Web USB. Calling the first scan requires a user gesture (~ button press)
    // After pairing, the device will be automatically re-connected (no scan needed)
    Controllers.get('EmpiriKitControl').scan();
  }

  _doScanForThingy52() {
    // Nordic Semiconductor Thingy:52 uses Web Bluetooth.  Scanning requires a user gesture (~ button press)
    Controllers.get('Thingy52Control').scan();
  }

  _enableAudio() {
    // Initiate Web Audio on a user gesture
    const aCtx = AudioUtils.ctx;
    aCtx.resume();

    this._initRecording();
    // TBD:  this could potentially be part of a splash screen or other natural element the user clicks anyway
  }

  _loadSound(evt) {
    this.loadEffect('./assets/audio/test.ogg', evt.target);
  }

  _playRecording() {
    const aCtx = AudioUtils.ctx;
    const src = aCtx.createBufferSource();
    src.buffer = this.lastRecording;
    src.connect(aCtx.destination);
    src.start(0);
  }

  loadEffect(url, target) {
    const aCtx = AudioUtils.ctx;

    const src = aCtx.createBufferSource();

    fetch(url)
    .then(response => response.arrayBuffer() )
    .then((buffer) => {
      aCtx.decodeAudioData(buffer, decodedData => {
        src.buffer = decodedData;

        target.data = decodedData;

        src.connect(aCtx.destination);
        src.start(0);
      });
    });
  }
}

customElements.define('main-app', MainApp.withProperties());