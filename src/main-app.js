// @ts-check
import { html, LitElement } from 'lit-element';

import {AudioUtils} from '../local_modules/audio-utils/audio-utils.js';
import {Controllers} from '../local_modules/instrument-control/instrument-control.js';
import { MIDI_MSG_TYPE_NAME, MIDI_MSG_TYPE } from '../local_modules/instrument-control/defs.js';

import '../local_modules/controller-settings/controller-settings.js';
import '../local_modules/mat-button/mat-button.js';
import { SampleVisualizer } from '../local_modules/sample-visualizer/sample-visualizer.js';


export class MainApp extends LitElement {

  constructor() {
    super();

    this.isRecording = false;
    this.isTrimming = false;

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
          AudioUtils.playEffectNote(this._sample, Math.pow(toneDiff, msg.note-60), msg.note, msg.velocity);
        } else if(msg.type === MIDI_MSG_TYPE.NOTE_OFF) {
          AudioUtils.stopNote(msg.note);
        }
      });
    }

  }

  static get properties() {
    return {
      isRecording: { type: Boolean },
      isTrimming: { type: Boolean }
    }
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

          this.lastRecordingBlob = blob;
          this.lastRecording = await AudioUtils.convertBlobToAudioBuffer(blob);
          this.isRecording = false;
        }

        this.mediaRecorder.ondataavailable = (e) => {
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
    this._lastRec.data = val;

    // Start by using the full sound (no trimming)
    this._sample = val;
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
          --line-color: #20ff20;
          --background-color: #001000;
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
          --background-color: #be6a3b;
          --background-color-hover: #e48149;
        }

        mat-button[active] {
          --background-color: #be3b47;
          --background-color-hover: #e14b59;
        }

      </style>
      <div class="flex-container">
        <div class="content">
          <div class="col">
            <h1>usBTronica</h1>
            <div class="row">
              <mat-button @click=${this._enableAudio}>Start audio</mat-button>
              <mat-button id="btnrecord" ?active=${this.isRecording} @click=${this._recordToggle}>
                ${this.isRecording ? "Stop recording" : "Start recording"}
              </mat-button>
              <mat-button @click=${this._doScanForEmpiriKit}>Scan for empiriKit</mat-button>
              <mat-button @click=${this._doScanForThingy52}>Scan for Thingy52</mat-button>
              <mat-button @click=${this._loadSound}>Load piano sound</mat-button>
              <mat-button .hidden=${!this.lastRecordingBlob} @click=${this._exportSound}>Export Recording</mat-button>
              <mat-button .hidden=${!this._lastRecording} ?active=${this.isTrimming} @click=${this._autoTrim}>
                ${this.isTrimming ? "Select in recording" : "Auto trim"}
              </mat-button>
            </div><br>
            Live:
            <sample-visualizer id='micSignal' class='live'></sample-visualizer><br>
            Recording:
            <sample-visualizer id="lastRec" @click=${this._clickInSample}></sample-visualizer><br>
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
    this.lastRecordingBlob = undefined;
    this.requestUpdate();
  }

  _exportSound() {
    if (this.lastRecordingBlob) {
      const exportElement = document.createElement('a');
      exportElement.download = `usbtronica-${Date.now()}.webm`;
      exportElement.href = URL.createObjectURL(this.lastRecordingBlob);
      exportElement.click();
    }
  }

  _autoTrim() {
    if (!this._lastRecording) return;

    this.isTrimming = !this.isTrimming;

    if (!this.isTrimming) {
      // Clicking button while trimming reverts to full sample
      this._sample = this.lastRecording;
      this._lastRec.showTrim(-1. -1);
    }

  }

  _clickInSample(evt) {
    if (!this.lastRecording) return;

    if (this.isTrimming) {
      /** @type{SampleVisualizer} */
      const el = evt.target;
      const rect = el.getBoundingClientRect();
      const fraction = (evt.clientX - rect.left) / rect.width;

      /** @type{Float32Array} */
      const sampleData = this.lastRecording.getChannelData(0);

      // Find spot in lastRecording and go left & right to trim (<HOLD> samples < Math.abs(<threshold>))
      const THRESHOLD = 0.002;  // TODO: Better support for noisy environments ;)
      const HOLD = 32;
      const startPos = Math.round(sampleData.length * fraction);

      // Left
      let count = 0;
      let left = startPos;
      while (count < HOLD && left > 0) {
        if (Math.abs(sampleData[left]) < THRESHOLD) {
          count++;
        } else {
          count = 0;
        }
        left--;
      }

      // Right
      count = 0;
      let right = startPos;
      while (count < HOLD && right < sampleData.length-1) {
        if (Math.abs(sampleData[right]) < THRESHOLD) {
          count++;
        } else {
          count = 0;
        }
        right++;
      }

      this._lastRec.showTrim(left, right);

      // copy trimmed data to playback sample buffer
      const aCtx = AudioUtils.ctx;
      const newBuffer = aCtx.createBuffer(1, right - left, this.lastRecording.sampleRate);
      const tmpArray = new Float32Array(right - left);
      this.lastRecording.copyFromChannel(tmpArray, 0, left);
      newBuffer.copyToChannel(tmpArray, 0, 0);
      this._sample = newBuffer;

      this.isTrimming = false;

      // Find area
    } else {
      AudioUtils.playSample(this._sample);
    }
  }

  firstUpdated() {
    /** @type {SampleVisualizer} */
    this._micSignal = this.shadowRoot.querySelector('#micSignal');

    /** @type {SampleVisualizer} */
    this._lastRec = this.shadowRoot.querySelector('#lastRec');
  }
}

customElements.define('main-app', MainApp);
