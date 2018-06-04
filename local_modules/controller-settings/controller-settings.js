// @ts-check
import {html, LitElement} from '../../modules/lit-html-element/lit-element.js';

import {Controllers} from '../instrument-control/instrument-control.js';


// const _defLineColor = 'rgb(255,20,20)';
// const _defBackgroundColor = 'rgb(50,10,10)';

export class ControllerSettings extends LitElement {
    constructor() {
        super();

        this.onChange = this.onChange.bind(this);

        for(let [type, controller] of Controllers) {
            console.log('Controller registered:', type);
            controller.addEventListener('connect', this.onChange);
            controller.addEventListener('disconnect', this.onChange);
            controller.addEventListener('message', this.onChange);
            controller.addEventListener('midi-event', (e) => console.log('midi-event', e.detail));
        }  
    }

    onChange() {
        this.invalidate();
    }

    render() {
        return html`
          <style>
            :host {
              display: block;
              margin: 0;
              background: #eee;
              -webkit-user-select: none;
              -moz-user-select: none;
              user-select: none;
              box-sizing: border-box;
            }
          </style>

          <ul>
          ${Array.from(Controllers).map(([key,val]) => {
              return html`<li>${key} (${val.devices.length}) - ${val.currentMessage}</li>`
          })}
          </ul>
        `;
    }
    
}
customElements.define('controller-settings', ControllerSettings);
