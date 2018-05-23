// @ts-check
import {html, LitElement} from '../../modules/lit-html-element/lit-element.js';

const _defLineColor = 'rgb(255,20,20)';
const _defBackgroundColor = 'rgb(50,10,10)';

export class RecordingVisualizer extends LitElement {
  constructor() {
      super();
      this._data = null;
  }

  get data() {
    return this._data;
  }

  set data(val) {
    this._data = val;
    this._prepData();
    this._renderCanvas();
  }

  connectedCallback() {
    super.connectedCallback();
    // console.log("connectedCallback");
    requestAnimationFrame(this._initialize.bind(this));
  }

  _initialize() {
    // console.log("initialize");

    this.canvas = this.$("viz");

    // grab colors
    this.lineColor = getComputedStyle(this).getPropertyValue('--line-color') || _defLineColor;
    this.backgroundColor = getComputedStyle(this).getPropertyValue('--background-color') || _defBackgroundColor;


    // window.addEventListener('resize', this.boundResizeCanvas);
    const ro = new ResizeObserver( entries => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        // console.log('Element:', entry.target);
        // console.log(`Element size: ${cr.width}px x ${cr.height}px`);
        // console.log(`Element padding: ${cr.top}px ; ${cr.left}px`);
        this._width = Math.ceil(cr.width);
        this._height = Math.ceil(cr.height);
        this.invalidate();
        requestAnimationFrame(this._renderCanvas.bind(this));
      }
    });
    
    // Observe one or multiple elements
    ro.observe(this);
  }

  // _resizeCanvas() {
  //   const rect = this.getBoundingClientRect();
  // }

  _prepData() {
    if(this._data instanceof AudioBuffer) {
      this._renderData = this._data.getChannelData(0);
    } else if(this._data instanceof Float32Array) {
      this._renderData = this._data;
    } else {
      this._renderData = null;
      this._renderDataMax = 0;
      this._renderDataMin = 0;
      return;
    }


    // TODO: test if it has a valid length...

    this._renderDataMax = this._renderData.reduce((a, b) => Math.max(a, b));
    this._renderDataMin = this._renderData.reduce((a, b) => Math.min(a, b));

    this._renderCanvas();
  }

  _renderCanvas() {
    const ctx = this.canvas.getContext("2d");
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0,0,this._width, this._height);

    ctx.strokeStyle = this.lineColor;
    const cy = this._height / 2;
    const amp = cy; // don't draw outside the box

    if(this._renderData) {
      const step = this._width / this._renderData.length;
      let x = 0;

      ctx.strokeStyle = this.lineColor;
      ctx.beginPath();

      for(let val of this._renderData) {
        if(x === 0) {
          ctx.moveTo(x, cy - amp * val);
        } else {
          ctx.lineTo(x, cy - amp * val);          
        }
        x += step;
      }

      ctx.stroke();
    }
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          margin: 0;
          background: rgba(255,0,0,0.3);
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
          box-sizing: border-box;
        }
        canvas {
          display: block;
          margin:0;
        }
      </style>
      <canvas id="viz" width="${this._width}" height="${this._height}"></canvas>
    `;
  }
}
customElements.define('recording-visualizer', RecordingVisualizer);
