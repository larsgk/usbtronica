// @ts-check
import {html, LitElement} from '../../modules/lit-html-element/lit-element.js';

// Default colors for the sample visualizer (red line on dark red background)
const _defLineColor = 'rgb(255,20,20)';
const _defBackgroundColor = 'rgb(50,10,10)';

export class SampleVisualizer extends LitElement {
  constructor() {
      super();
      this._data = null;

      this._renderCanvas = this._renderCanvas.bind(this);
  }

  get data() {
    return this._data;
  }

  set data(val) {
    this._data = val;
    this._prepData();
    requestAnimationFrame(this._renderCanvas);
  }

  connectedCallback() {
    super.connectedCallback();
    requestAnimationFrame(this._initialize.bind(this));
  }

  _initialize() {
    this.canvas = this.$("viz");

    // Grab the colors from the CSS Custom Properties, use the defaults if none are defined.
    const style = getComputedStyle(this)
    this.lineColor = style.getPropertyValue('--line-color') || _defLineColor;
    this.backgroundColor = style.getPropertyValue('--background-color') || _defBackgroundColor;


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
        requestAnimationFrame(this._renderCanvas);
      }
    });
    
    // Observe one or multiple elements
    ro.observe(this.$('vizdiv'));
  }

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
      // If the data buffer is limited in size, do full line drawing.
      if(this._renderData.length < this._width * 4) {
        const step = this._width / this._renderData.length;
        let x = 0;
  
        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = 3;
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
      } else {
        // Optimized drawing for larger data sets.
        const step = Math.floor(this._renderData.length / this._width);

        ctx.fillStyle = this.lineColor;
  
        for(let i=0; i < this._width; i++){
          let min = 1.0;
          let max = -1.0;
          for (let j=0; j<step; j++) {
              const datum = this._renderData[(i*step)+j]; 
              if (datum < min)
                  min = datum;
              if (datum > max)
                  max = datum;
          }
          ctx.fillRect(i,(1+min)*amp,1,Math.max(1,(max-min)*amp));
        }  
      }
    }
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          margin:0;
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
          box-sizing: border-box;
        }
        div {
          display: inline-block;
          position: relative;
          box-sizing: border-box;
          padding: 0.2em;
          height:100%;
          width:100%;
        }
        canvas {
          display: block;
          margin:0;
          border-radius: 15px;
          box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
        }
      </style>
      <div id="vizdiv">
        <canvas id="viz" width="${this._width}" height="${this._height}"></canvas>
      </div>
    `;
  }
}
customElements.define('sample-visualizer', SampleVisualizer);
