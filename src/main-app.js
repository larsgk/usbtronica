// @ts-check
import { html, LitElement } from 'https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module';
import { repeat } from 'https://unpkg.com/lit-html@0.13.0/directives/repeat.js?module';

import {MatButton} from '../local_modules/mat-button/mat-button.js';
import {SampleVisualizer} from '../local_modules/sample-visualizer/sample-visualizer.js';

import {AudioUtils} from '../local_modules/audio-utils/audio-utils.js';

import {Controllers} from '../local_modules/instrument-control/instrument-control.js';
import { MIDI_MSG_TYPE_NAME, MIDI_MSG_TYPE } from '../local_modules/instrument-control/defs.js';
import { ControllerSettings } from '../local_modules/controller-settings/controller-settings.js';


export class MainApp extends LitElement {

  constructor() {
    super();

    // Bind all callbacks 
    this._doScanForEmpiriKit = this._doScanForEmpiriKit.bind(this);
    this._doScanForThingy52 = this._doScanForThingy52.bind(this);
    this._recordToggle = this._recordToggle.bind(this);
    this._loadSound = this._loadSound.bind(this);
    this._playActiveSample = this._playActiveSample.bind(this);

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
          AudioUtils.playEffectNote(this.lastRecording, Math.pow(toneDiff, msg.note-60), msg.note, msg.velocity);
        } else if(msg.type === MIDI_MSG_TYPE.NOTE_OFF) {
          AudioUtils.stopNote(msg.note);
        }
      });
    }

  }

  connectedCallback() {
    super.connectedCallback();
    requestAnimationFrame(_ => {
      this._initialize()
    });
  }

  static get properties() {
    return {
      isRecording: {
        type: Boolean
      }
    }
  }

  

  _initialize() {
    this._micSignal =  this.shadowRoot.getElementById('micSignal');
  }

  _initRecording() {
    if (navigator.getUserMedia) {
      let constraints = { audio: true, video: false };
      let chunks = [];

      let onSuccess = stream => {
        this.mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'});

        this._visualize(stream);

        this.mediaRecorder.onstop = async (e) => {
          var blob = new Blob(chunks, { 'type' : 'audio/webm' });
          chunks = [];

          this.lastRecording = await AudioUtils.convertBlobToAudioBuffer(blob);
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

  get lastRecording() {
    return this._lastRecording;
  }

  set lastRecording(val) {
    this._lastRecording = val;
     this.shadowRoot.getElementById('lastRec').data = val;
  }

  _visualize(stream) {
    const aCtx = AudioUtils.ctx;

    let source = aCtx.createMediaStreamSource(stream);

    let analyser = aCtx.createAnalyser();
    analyser.fftSize = 1024;
    let dataArray = new Float32Array(analyser.fftSize);

    this._micSignal.data = dataArray;

    source.connect(analyser);

    let draw = () => {
      requestAnimationFrame(draw);
      analyser.getFloatTimeDomainData(dataArray);
      this._micSignal.data = dataArray;
    }

    draw();
  }

  render() {
    return html`
      <style>
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

        .live {
          --line-color:#20ff20;
          --background-color:#001000;
        }

        .flex-container {
          display: flex;
          height: 100%;
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
              <mat-button @click='${ this._enableAudio }'>Start audio</mat-button>
              <mat-button id="btnrecord" @click='${ this._recordToggle }'>${this.isRecording ? "Stop recording" : "Start recording"}</mat-button>
              <mat-button @click='${ this._doScanForEmpiriKit }'>Scan for empiriKit</mat-button>
              <mat-button @click='${ this._doScanForThingy52 }'>Scan for Thingy52</mat-button>
              <mat-button @click='${ this._loadSound }'>Load piano sound</mat-button>
            </div><br>
            Live:
            <sample-visualizer id='micSignal' class='live'></sample-visualizer><br>
            Recording:
            <sample-visualizer id="lastRec" @click='${ this._playActiveSample }'></sample-visualizer><br>
            ...TODO future cool settings:
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

  async _loadSound(evt) {
    this.lastRecording = await AudioUtils.loadSample('./assets/audio/piano_c.ogg');
  }

  _playActiveSample() {
    AudioUtils.playSample(this.lastRecording);
  }
}

customElements.define('main-app', MainApp);