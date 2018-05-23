import { html, render } from '../lit-html/lib/lit-extended.js';
export { html } from '../lit-html/lib/lit-extended.js';
export { TemplateResult } from '../lit-html/lit-html.js';
export function createProperty(prototype, propertyName, options = {}) {
    if (!prototype.constructor.hasOwnProperty('properties')) {
        Object.defineProperty(prototype.constructor, 'properties', { value: {} });
    }
    prototype.constructor.properties[propertyName] = options;
    // Cannot attach from the decorator, won't override property.
    Promise.resolve().then(() => attachProperty(prototype, propertyName, options));
}
function attachProperty(prototype, propertyName, options) {
    const { type: typeFn, attrName } = options;
    function get() { return this.__values__[propertyName]; }
    function set(v) {
        // @ts-ignore
        let value = (v === null || v === undefined) ? v : (typeFn === Array ? v : typeFn(v));
        this._setPropertyValue(propertyName, value);
        if (attrName) {
            this._setAttributeValue(attrName, value, typeFn);
        }
        this.invalidate();
    }
    Object.defineProperty(prototype, propertyName, options.computed ? { get } : { get, set });
}
export function whenAllDefined(result) {
    const template = result.template;
    const rootNode = template.element.content;
    const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT, null, false);
    const deps = new Set();
    while (walker.nextNode()) {
        const element = walker.currentNode;
        if (element.tagName.includes('-')) {
            deps.add(element.tagName.toLowerCase());
        }
    }
    return Promise.all(Array.from(deps).map(tagName => customElements.whenDefined(tagName)));
}
export class LitElement extends HTMLElement {
    constructor() {
        super();
        this._needsRender = false;
        this._lookupCache = {};
        this._attrMap = {};
        this._deps = {};
        this.__values__ = {};
        this.attachShadow({ mode: 'open' });
        for (const propertyName in this.constructor.properties) {
            const options = this.constructor.properties[propertyName];
            const { value, attrName, computed } = options;
            // We can only handle properly defined attributes.
            if (typeof (attrName) === 'string' && attrName.length) {
                this._attrMap[attrName] = propertyName;
            }
            // Properties backed by attributes have default values set from attributes, not 'value'.
            if (!attrName && value !== undefined) {
                this._setPropertyValue(propertyName, value);
            }
            const match = /(\w+)\((.+)\)/.exec(computed);
            if (match) {
                const fnName = match[1];
                const targets = match[2].split(/,\s*/);
                const computeFn = () => {
                    const values = targets.map(target => this[target]);
                    if (this[fnName] && values.every(entry => entry !== undefined)) {
                        const computedValue = this[fnName].apply(this, values);
                        this._setPropertyValue(propertyName, computedValue);
                    }
                };
                for (const target of targets) {
                    if (!this._deps[target]) {
                        this._deps[target] = [computeFn];
                    }
                    else {
                        this._deps[target].push(computeFn);
                    }
                }
                computeFn();
            }
        }
    }
    _setPropertyValue(propertyName, newValue) {
        this.__values__[propertyName] = newValue;
        if (this._deps[propertyName]) {
            this._deps[propertyName].map((fn) => fn());
        }
    }
    _setPropertyValueFromAttributeValue(attrName, newValue) {
        const propertyName = this._attrMap[attrName];
        const { type: typeFn } = this.constructor.properties[propertyName];
        let value;
        if (typeFn.name === 'Boolean') {
            value = (newValue === '') || (!!newValue && newValue === attrName.toLowerCase());
        }
        else {
            value = (newValue !== null) ? typeFn(newValue) : undefined;
        }
        this._setPropertyValue(propertyName, value);
    }
    _setAttributeValue(attrName, value, typeFn) {
        // @ts-ignore
        if (typeFn.name === 'Boolean') {
            if (!value) {
                this.removeAttribute(attrName);
            }
            else {
                this.setAttribute(attrName, '');
            }
        }
        else {
            this.setAttribute(attrName, value);
        }
    }
    static get properties() {
        return {};
    }
    static get listeners() {
        return [];
    }
    static get observedAttributes() {
        return Object.keys(this.properties)
            .map(key => this.properties[key].attrName)
            .filter(name => name);
    }
    static withProperties() {
        for (const propertyName in this.properties) {
            attachProperty(this.prototype, propertyName, this.properties[propertyName]);
        }
        return this;
    }
    renderCallback() {
        render(this.render(this), this.shadowRoot);
    }
    // @ts-ignore
    render(self) {
        return html ``;
    }
    attributeChangedCallback(attrName, _oldValue, newValue) {
        this._setPropertyValueFromAttributeValue(attrName, newValue);
        this.invalidate();
    }
    connectedCallback() {
        for (const attrName of this.constructor.observedAttributes) {
            this._setPropertyValueFromAttributeValue(attrName, this.getAttribute(attrName));
        }
        this.invalidate().then(() => {
            for (const listener of this.constructor.listeners) {
                const target = typeof listener.target === 'string' ? this.$(listener.target) : listener.target;
                target.addEventListener(listener.eventName, listener.handler.bind(this));
            }
        });
    }
    async invalidate() {
        if (!this._needsRender) {
            this._needsRender = true;
            // Schedule the following as micro task, which runs before
            // requestAnimationFrame. All additional invalidate() calls
            // before will be ignored.
            // https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
            this._needsRender = await false;
            this.renderCallback();
        }
    }
    $(id) {
        let value = this._lookupCache[id];
        if (!value && this.shadowRoot) {
            const element = this.shadowRoot.getElementById(id);
            if (element) {
                value = element;
                this._lookupCache[id] = element;
            }
        }
        return value;
    }
}
//# sourceMappingURL=lit-element.js.map