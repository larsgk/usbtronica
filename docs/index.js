/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const t=new WeakMap,e=e=>"function"==typeof e&&t.has(e),i=void 0!==window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,s=(t,e,i=null)=>{for(;e!==i;){const i=e.nextSibling;t.removeChild(e),e=i}},n={},o={},r=`{{lit-${String(Math.random()).slice(2)}}}`,a=`\x3c!--${r}--\x3e`,c=new RegExp(`${r}|${a}`);class h{constructor(t,e){this.parts=[],this.element=e;const i=[],s=[],n=document.createTreeWalker(e.content,133,null,!1);let o=0,a=-1,h=0;const{strings:d,values:{length:m}}=t;for(;h<m;){const t=n.nextNode();if(null!==t){if(a++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:i}=e;let s=0;for(let t=0;t<i;t++)l(e[t].name,"$lit$")&&s++;for(;s-- >0;){const e=d[h],i=p.exec(e)[2],s=i.toLowerCase()+"$lit$",n=t.getAttribute(s);t.removeAttribute(s);const o=n.split(c);this.parts.push({type:"attribute",index:a,name:i,strings:o}),h+=o.length-1}}"TEMPLATE"===t.tagName&&(s.push(t),n.currentNode=t.content)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(r)>=0){const s=t.parentNode,n=e.split(c),o=n.length-1;for(let e=0;e<o;e++){let i,o=n[e];if(""===o)i=u();else{const t=p.exec(o);null!==t&&l(t[2],"$lit$")&&(o=o.slice(0,t.index)+t[1]+t[2].slice(0,-"$lit$".length)+t[3]),i=document.createTextNode(o)}s.insertBefore(i,t),this.parts.push({type:"node",index:++a})}""===n[o]?(s.insertBefore(u(),t),i.push(t)):t.data=n[o],h+=o}}else if(8===t.nodeType)if(t.data===r){const e=t.parentNode;null!==t.previousSibling&&a!==o||(a++,e.insertBefore(u(),t)),o=a,this.parts.push({type:"node",index:a}),null===t.nextSibling?t.data="":(i.push(t),a--),h++}else{let e=-1;for(;-1!==(e=t.data.indexOf(r,e+1));)this.parts.push({type:"node",index:-1}),h++}}else n.currentNode=s.pop()}for(const t of i)t.parentNode.removeChild(t)}}const l=(t,e)=>{const i=t.length-e.length;return i>=0&&t.slice(i)===e},d=t=>-1!==t.index,u=()=>document.createComment(""),p=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class m{constructor(t,e,i){this.__parts=[],this.template=t,this.processor=e,this.options=i}update(t){let e=0;for(const i of this.__parts)void 0!==i&&i.setValue(t[e]),e++;for(const t of this.__parts)void 0!==t&&t.commit()}_clone(){const t=i?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],s=this.template.parts,n=document.createTreeWalker(t,133,null,!1);let o,r=0,a=0,c=n.nextNode();for(;r<s.length;)if(o=s[r],d(o)){for(;a<o.index;)a++,"TEMPLATE"===c.nodeName&&(e.push(c),n.currentNode=c.content),null===(c=n.nextNode())&&(n.currentNode=e.pop(),c=n.nextNode());if("node"===o.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(c.previousSibling),this.__parts.push(t)}else this.__parts.push(...this.processor.handleAttributeExpressions(c,o.name,o.strings,this.options));r++}else this.__parts.push(void 0),r++;return i&&(document.adoptNode(t),customElements.upgrade(t)),t}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const _=` ${r} `;class g{constructor(t,e,i,s){this.strings=t,this.values=e,this.type=i,this.processor=s}getHTML(){const t=this.strings.length-1;let e="",i=!1;for(let s=0;s<t;s++){const t=this.strings[s],n=t.lastIndexOf("\x3c!--");i=(n>-1||i)&&-1===t.indexOf("--\x3e",n+1);const o=p.exec(t);e+=null===o?t+(i?_:a):t.substr(0,o.index)+o[1]+o[2]+"$lit$"+o[3]+r}return e+=this.strings[t],e}getTemplateElement(){const t=document.createElement("template");return t.innerHTML=this.getHTML(),t}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const v=t=>null===t||!("object"==typeof t||"function"==typeof t),f=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class y{constructor(t,e,i){this.dirty=!0,this.element=t,this.name=e,this.strings=i,this.parts=[];for(let t=0;t<i.length-1;t++)this.parts[t]=this._createPart()}_createPart(){return new b(this)}_getValue(){const t=this.strings,e=t.length-1;let i="";for(let s=0;s<e;s++){i+=t[s];const e=this.parts[s];if(void 0!==e){const t=e.value;if(v(t)||!f(t))i+="string"==typeof t?t:String(t);else for(const e of t)i+="string"==typeof e?e:String(e)}}return i+=t[e],i}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class b{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===n||v(t)&&t===this.value||(this.value=t,e(t)||(this.committer.dirty=!0))}commit(){for(;e(this.value);){const t=this.value;this.value=n,t(this)}this.value!==n&&this.committer.commit()}}class w{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(u()),this.endNode=t.appendChild(u())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=u()),t.__insert(this.endNode=u())}insertAfterPart(t){t.__insert(this.startNode=u()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){for(;e(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=n,t(this)}const t=this.__pendingValue;t!==n&&(v(t)?t!==this.value&&this.__commitText(t):t instanceof g?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):f(t)?this.__commitIterable(t):t===o?(this.value=o,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){const e=this.startNode.nextSibling,i="string"==typeof(t=null==t?"":t)?t:String(t);e===this.endNode.previousSibling&&3===e.nodeType?e.data=i:this.__commitNode(document.createTextNode(i)),this.value=t}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof m&&this.value.template===e)this.value.update(t.values);else{const i=new m(e,t.processor,this.options),s=i._clone();i.update(t.values),this.__commitNode(s),this.value=i}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let i,s=0;for(const n of t)i=e[s],void 0===i&&(i=new w(this.options),e.push(i),0===s?i.appendIntoPart(this):i.insertAfterPart(e[s-1])),i.setValue(n),i.commit(),s++;s<e.length&&(e.length=s,this.clear(i&&i.endNode))}clear(t=this.startNode){s(this.startNode.parentNode,t.nextSibling,this.endNode)}}class S{constructor(t,e,i){if(this.value=void 0,this.__pendingValue=void 0,2!==i.length||""!==i[0]||""!==i[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=i}setValue(t){this.__pendingValue=t}commit(){for(;e(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=n,t(this)}if(this.__pendingValue===n)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=n}}class x extends y{constructor(t,e,i){super(t,e,i),this.single=2===i.length&&""===i[0]&&""===i[1]}_createPart(){return new C(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class C extends b{}let T=!1;try{const t={get capture(){return T=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}class E{constructor(t,e,i){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=i,this.__boundHandleEvent=t=>this.handleEvent(t)}setValue(t){this.__pendingValue=t}commit(){for(;e(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=n,t(this)}if(this.__pendingValue===n)return;const t=this.__pendingValue,i=this.value,s=null==t||null!=i&&(t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive),o=null!=t&&(null==i||s);s&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),o&&(this.__options=N(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=n}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const N=t=>t&&(T?{capture:t.capture,passive:t.passive,once:t.once}:t.capture)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */;const A=new class{handleAttributeExpressions(t,e,i,s){const n=e[0];if("."===n){return new x(t,e.slice(1),i).parts}return"@"===n?[new E(t,e.slice(1),s.eventContext)]:"?"===n?[new S(t,e.slice(1),i)]:new y(t,e,i).parts}handleTextExpression(t){return new w(t)}};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */function M(t){let e=P.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},P.set(t.type,e));let i=e.stringsArray.get(t.strings);if(void 0!==i)return i;const s=t.strings.join(r);return i=e.keyString.get(s),void 0===i&&(i=new h(t,t.getTemplateElement()),e.keyString.set(s,i)),e.stringsArray.set(t.strings,i),i}const P=new Map,R=new WeakMap;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.1.2");const D=(t,...e)=>new g(t,e,"html",A)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */;function I(t,e){const{element:{content:i},parts:s}=t,n=document.createTreeWalker(i,133,null,!1);let o=O(s),r=s[o],a=-1,c=0;const h=[];let l=null;for(;n.nextNode();){a++;const t=n.currentNode;for(t.previousSibling===l&&(l=null),e.has(t)&&(h.push(t),null===l&&(l=t)),null!==l&&c++;void 0!==r&&r.index===a;)r.index=null!==l?-1:r.index-c,o=O(s,o),r=s[o]}h.forEach(t=>t.parentNode.removeChild(t))}const k=t=>{let e=11===t.nodeType?0:1;const i=document.createTreeWalker(t,133,null,!1);for(;i.nextNode();)e++;return e},O=(t,e=-1)=>{for(let i=e+1;i<t.length;i++){const e=t[i];if(d(e))return i}return-1};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const V=(t,e)=>`${t}--${e}`;let $=!0;void 0===window.ShadyCSS?$=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),$=!1);const z=t=>e=>{const i=V(e.type,t);let s=P.get(i);void 0===s&&(s={stringsArray:new WeakMap,keyString:new Map},P.set(i,s));let n=s.stringsArray.get(e.strings);if(void 0!==n)return n;const o=e.strings.join(r);if(n=s.keyString.get(o),void 0===n){const i=e.getTemplateElement();$&&window.ShadyCSS.prepareTemplateDom(i,t),n=new h(e,i),s.keyString.set(o,n)}return s.stringsArray.set(e.strings,n),n},B=["html","svg"],F=new Set,U=(t,e,i)=>{F.add(t);const s=i?i.element:document.createElement("template"),n=e.querySelectorAll("style"),{length:o}=n;if(0===o)return void window.ShadyCSS.prepareTemplateStyles(s,t);const r=document.createElement("style");for(let t=0;t<o;t++){const e=n[t];e.parentNode.removeChild(e),r.textContent+=e.textContent}(t=>{B.forEach(e=>{const i=P.get(V(e,t));void 0!==i&&i.keyString.forEach(t=>{const{element:{content:e}}=t,i=new Set;Array.from(e.querySelectorAll("style")).forEach(t=>{i.add(t)}),I(t,i)})})})(t);const a=s.content;i?function(t,e,i=null){const{element:{content:s},parts:n}=t;if(null==i)return void s.appendChild(e);const o=document.createTreeWalker(s,133,null,!1);let r=O(n),a=0,c=-1;for(;o.nextNode();){for(c++,o.currentNode===i&&(a=k(e),i.parentNode.insertBefore(e,i));-1!==r&&n[r].index===c;){if(a>0){for(;-1!==r;)n[r].index+=a,r=O(n,r);return}r=O(n,r)}}}(i,r,a.firstChild):a.insertBefore(r,a.firstChild),window.ShadyCSS.prepareTemplateStyles(s,t);const c=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==c)e.insertBefore(c.cloneNode(!0),e.firstChild);else if(i){a.insertBefore(r,a.firstChild);const t=new Set;t.add(r),I(i,t)}};window.JSCompiler_renameProperty=(t,e)=>t;const L={toAttribute(t,e){switch(e){case Boolean:return t?"":null;case Object:case Array:return null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){switch(e){case Boolean:return null!==t;case Number:return null===t?null:Number(t);case Object:case Array:return JSON.parse(t)}return t}},q=(t,e)=>e!==t&&(e==e||t==t),H={attribute:!0,type:String,converter:L,reflect:!1,hasChanged:q},j=Promise.resolve(!0);class K extends HTMLElement{constructor(){super(),this._updateState=0,this._instanceProperties=void 0,this._updatePromise=j,this._hasConnectedResolver=void 0,this._changedProperties=new Map,this._reflectingProperties=void 0,this.initialize()}static get observedAttributes(){this.finalize();const t=[];return this._classProperties.forEach((e,i)=>{const s=this._attributeNameForProperty(i,e);void 0!==s&&(this._attributeToPropertyMap.set(s,i),t.push(s))}),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const t=Object.getPrototypeOf(this)._classProperties;void 0!==t&&t.forEach((t,e)=>this._classProperties.set(e,t))}}static createProperty(t,e=H){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;const i="symbol"==typeof t?Symbol():`__${t}`;Object.defineProperty(this.prototype,t,{get(){return this[i]},set(e){const s=this[t];this[i]=e,this._requestUpdate(t,s)},configurable:!0,enumerable:!0})}static finalize(){const t=Object.getPrototypeOf(this);if(t.hasOwnProperty("finalized")||t.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const t=this.properties,e=[...Object.getOwnPropertyNames(t),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t):[]];for(const i of e)this.createProperty(i,t[i])}}static _attributeNameForProperty(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}static _valueHasChanged(t,e,i=q){return i(t,e)}static _propertyValueFromAttribute(t,e){const i=e.type,s=e.converter||L,n="function"==typeof s?s:s.fromAttribute;return n?n(t,i):t}static _propertyValueToAttribute(t,e){if(void 0===e.reflect)return;const i=e.type,s=e.converter;return(s&&s.toAttribute||L.toAttribute)(t,i)}initialize(){this._saveInstanceProperties(),this._requestUpdate()}_saveInstanceProperties(){this.constructor._classProperties.forEach((t,e)=>{if(this.hasOwnProperty(e)){const t=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,t)}})}_applyInstanceProperties(){this._instanceProperties.forEach((t,e)=>this[e]=t),this._instanceProperties=void 0}connectedCallback(){this._updateState=32|this._updateState,this._hasConnectedResolver&&(this._hasConnectedResolver(),this._hasConnectedResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,i){e!==i&&this._attributeToProperty(t,i)}_propertyToAttribute(t,e,i=H){const s=this.constructor,n=s._attributeNameForProperty(t,i);if(void 0!==n){const t=s._propertyValueToAttribute(e,i);if(void 0===t)return;this._updateState=8|this._updateState,null==t?this.removeAttribute(n):this.setAttribute(n,t),this._updateState=-9&this._updateState}}_attributeToProperty(t,e){if(8&this._updateState)return;const i=this.constructor,s=i._attributeToPropertyMap.get(t);if(void 0!==s){const t=i._classProperties.get(s)||H;this._updateState=16|this._updateState,this[s]=i._propertyValueFromAttribute(e,t),this._updateState=-17&this._updateState}}_requestUpdate(t,e){let i=!0;if(void 0!==t){const s=this.constructor,n=s._classProperties.get(t)||H;s._valueHasChanged(this[t],e,n.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),!0!==n.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,n))):i=!1}!this._hasRequestedUpdate&&i&&this._enqueueUpdate()}requestUpdate(t,e){return this._requestUpdate(t,e),this.updateComplete}async _enqueueUpdate(){let t,e;this._updateState=4|this._updateState;const i=this._updatePromise;this._updatePromise=new Promise((i,s)=>{t=i,e=s});try{await i}catch(t){}this._hasConnected||await new Promise(t=>this._hasConnectedResolver=t);try{const t=this.performUpdate();null!=t&&await t}catch(t){e(t)}t(!this._hasRequestedUpdate)}get _hasConnected(){return 32&this._updateState}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){this._instanceProperties&&this._applyInstanceProperties();let t=!1;const e=this._changedProperties;try{t=this.shouldUpdate(e),t&&this.update(e)}catch(e){throw t=!1,e}finally{this._markUpdated()}t&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((t,e)=>this._propertyToAttribute(e,this[e],t)),this._reflectingProperties=void 0)}updated(t){}firstUpdated(t){}}K.finalized=!0;
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const W="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */(window.litElementVersions||(window.litElementVersions=[])).push("2.2.1");const Y=t=>t.flat?t.flat(1/0):function t(e,i=[]){for(let s=0,n=e.length;s<n;s++){const n=e[s];Array.isArray(n)?t(n,i):i.push(n)}return i}(t);class J extends K{static finalize(){super.finalize.call(this),this._styles=this.hasOwnProperty(JSCompiler_renameProperty("styles",this))?this._getUniqueStyles():this._styles||[]}static _getUniqueStyles(){const t=this.styles,e=[];if(Array.isArray(t)){Y(t).reduceRight((t,e)=>(t.add(e),t),new Set).forEach(t=>e.unshift(t))}else t&&e.push(t);return e}initialize(){super.initialize(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const t=this.constructor._styles;0!==t.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?W?this.renderRoot.adoptedStyleSheets=t.map(t=>t.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(t=>t.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(t){super.update(t);const e=this.render();e instanceof g&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(t=>{const e=document.createElement("style");e.textContent=t.cssText,this.renderRoot.appendChild(e)}))}render(){}}J.finalized=!0,J.render=(t,e,i)=>{if(!i||"object"!=typeof i||!i.scopeName)throw new Error("The `scopeName` option is required.");const n=i.scopeName,o=R.has(e),r=$&&11===e.nodeType&&!!e.host,a=r&&!F.has(n),c=a?document.createDocumentFragment():e;if(((t,e,i)=>{let n=R.get(e);void 0===n&&(s(e,e.firstChild),R.set(e,n=new w(Object.assign({templateFactory:M},i))),n.appendInto(e)),n.setValue(t),n.commit()})(t,c,Object.assign({templateFactory:z(n)},i)),a){const t=R.get(c);R.delete(c);const i=t.value instanceof m?t.value.template:void 0;U(n,c,i),s(e,e.firstChild),e.appendChild(c),R.set(e,t)}!o&&r&&window.ShadyCSS.styleElement(e.host)};class X extends EventTarget{constructor(){super(),this._notes=[],this.playEffectNote=this.playEffectNote.bind(this),this.stopNote=this.stopNote.bind(this),this.convertBlobToAudioBuffer=this.convertBlobToAudioBuffer.bind(this),this.loadSample=this.loadSample.bind(this),this.playSample=this.playSample.bind(this)}get ctx(){return this._audioCtx||(this._audioCtx=new(AudioContext||webkitAudioContext)),this._audioCtx}playEffectNote(t,e,i,s){void 0===s&&(s=127);const n=this.ctx.createBufferSource();e&&(n.playbackRate.value=e),n.buffer=t;const o=this.ctx.createGain();o.gain.value=s/127,n.connect(o),o.connect(this.ctx.destination),n.start(0),this._notes[i]=n}stopNote(t){let e=this._notes[t];e&&e.stop()}async convertBlobToAudioBuffer(t){var e=new FileReader;return new Promise((i,s)=>{e.onloadend=()=>{this.ctx.decodeAudioData(e.result,t=>{i(t)})},e.readAsArrayBuffer(t)})}async loadSample(t){return new Promise((e,i)=>{fetch(t).then(t=>t.arrayBuffer()).then(t=>{this.ctx.decodeAudioData(t,t=>{e(t)})})})}playSample(t){const e=this.ctx.createBufferSource();e.buffer=t,e.connect(this.ctx.destination),e.start(0)}}const G=new X;class Q extends EventTarget{constructor(t){super(),this._controllerType=t,this.devices=[],this.MAX_VELOCITY=127}get controllerType(){return this._controllerType}emitConnected(t){if(this.devices.includes(t))throw`Device ${t} on ${this._controllerType} already connected!`;this.devices.push(t),this.dispatchEvent(new CustomEvent("connect",{detail:{type:this._controllerType,device:t}}))}emitDisconnected(t){const e=this.devices.indexOf(t);if(-1===e)throw`Device ${t} doesn't exist on ${this._controllerType}!`;this.devices.splice(e,1),this.dispatchEvent(new CustomEvent("disconnect",{detail:{type:this._controllerType,device:t}}))}emitControlEvent(t,e){this.dispatchEvent(new CustomEvent("midi-event",{detail:{type:this._controllerType,device:t,data:e}}))}emitMessage(t,e){this.currentMessage=e,this.dispatchEvent(new CustomEvent("message",{detail:{type:this._controllerType,device:t,message:e}}))}}const Z=128,tt=144,et=160,it=176,st=224,nt={128:"NOTE_OFF",144:"NOTE_ON",160:"KEY_PRESSURE",176:"CONTROL_CHANGE",192:"PROGRAM_CHANGE",208:"CHANNEL_PRESSURE",224:"PITCH_BEND_CHANGE"},ot=4617,rt=53271;const at=new Map,ct=(new class extends Q{constructor(){super("DummyControl"),this._runNextCmd=this._runNextCmd.bind(this),this._deviceId="Dummy1",this._nextCmd=0,this._cmds=[{cmd:()=>{this.emitConnected(this._deviceId)},t:1e3},{cmd:()=>{this.emitMessage(this._deviceId,"Much Foo...")},t:1e3},{cmd:()=>{this.emitMessage(this._deviceId,"Such Bar...")},t:1e3},{cmd:()=>{this.emitMessage(this._deviceId,"")},t:1e3},{cmd:()=>{this.emitDisconnected(this._deviceId)},t:2e3}],window.setTimeout(()=>{this._runNextCmd()},0)}_runNextCmd(){const t=this._cmds[this._nextCmd];this._nextCmd=++this._nextCmd%this._cmds.length,t.cmd(),window.setTimeout(this._runNextCmd,t.t)}},new class extends Q{constructor(){super("EmpiriKitControl"),this._startDataStream=this._startDataStream.bind(this),this._note=-1,this._touch=0,this._velocity=0,window.setTimeout(()=>{this.initialize()},0)}initialize(){navigator.usb.getDevices().then(t=>{for(let e of t)e.vendorId===ot&&e.productId===rt&&this._openDevice(e);throw"no device available yet"}).catch(t=>{console.log(t)}),navigator.usb.addEventListener("connect",t=>this._openDevice(t.device))}scan(){navigator.usb.requestDevice({filters:[{vendorId:ot,productId:rt}]}).then(t=>{this._openDevice(t)}).catch(t=>{console.log(t)})}readFromDevice(){this.device.transferIn(5,64).then(t=>{const e=new TextDecoder;this.rstring+=e.decode(t.data);const i=this.rstring.indexOf("{");i>0&&(this.rstring=this.rstring.substring(i));const s=this.rstring.indexOf("}");if(s>-1){const t=this.rstring.substring(0,s+1);this.rstring=this.rstring.substring(s+1);try{const e=JSON.parse(t);this._handleMessage(e)}catch(e){console.log("NOT JSON:",t)}this.rstring=""}this.readFromDevice()}).catch(t=>{console.log(t),this.emitMessage(this.device.serialNumber,""),this.emitDisconnected(this.device.serialNumber),this.device=null,this.rstring=""})}sendCMD(t){console.log(`Sending to serial: [${t}]\n`);let e=new TextEncoder("utf-8").encode(t);console.log(e),this.device&&this.device.transferOut(5,e)}_startDataStream(){this.sendCMD('{"SETRTE":10}'),this.sendCMD('{"STRACC":1}'),this.sendCMD('{"STRTCH":1}')}_handleMessage(t){if("StreamData"===t.datatype){this.tick=t.tick;let e=t.accelerometerdata,i=t.touchsensordata;if(void 0!==e){const t=this.device.serialNumber,i=9.82/16384,s={x:+e[0]*i,y:-e[1]*i,z:+e[2]*i},n=Math.round(60+s.y),o=Math.min(Math.max(0,Math.round(63-8*s.x)),this.MAX_VELOCITY);this._note==n&&this._velocity==o||(this._note=n,this._velocity=o,this.emitMessage(t,`Note #${this._note} @ vel ${this._velocity}`))}void 0!==i&&(0===this._touch&&0!==i||0!==this._touch&&0===i)&&(0!==i?this._note&&(this.emitControlEvent(this.device.serialNumber,{type:tt,channel:0,note:this._note,velocity:this._velocity}),this._lastNote=this._note):this._lastNote&&this.emitControlEvent(this.device.serialNumber,{type:Z,channel:0,note:this._lastNote,velocity:this.MAX_VELOCITY}),this._touch=i)}else"HardwareInfo"===t.datatype?(this.capabilities=t.capabilities,this.uid=t.uid,this.version=t.version):console.log(t)}_openDevice(t){t.open().then(e=>t.selectConfiguration(1)).then(e=>t.claimInterface(2)).then(e=>t.controlTransferOut({requestType:"class",recipient:"interface",request:34,value:1,index:2})).then(e=>{this.rstring="",this.device=t,this.emitConnected(this.device.serialNumber),setTimeout(this._startDataStream,500),this.readFromDevice()}).catch(t=>{console.log(t)})}}),ht=new class extends Q{constructor(){super("KeyboardControl"),this._channel=0,this._deviceId=0,window.setTimeout(()=>{this.initialize()},0),window.setTimeout(()=>{this.emitConnected(this._deviceId)},100)}initialize(){const t={KeyQ:60,Digit2:61,KeyW:62,Digit3:63,KeyE:64,KeyR:65,Digit5:66,KeyT:67,Digit6:68,KeyY:69,Digit7:70,KeyU:71,KeyI:72};document.addEventListener("keydown",e=>{if(!e.repeat){const i=t[e.code];void 0!==i?this.emitControlEvent(this._deviceId,{type:tt,channel:this._channel,note:i,velocity:this.MAX_VELOCITY}):console.log("pressed: ",e.code)}}),document.addEventListener("keyup",e=>{if(!e.repeat){const i=t[e.code];void 0!==i&&this.emitControlEvent(this._deviceId,{type:Z,channel:this._channel,note:i,velocity:this.MAX_VELOCITY})}})}},lt=new class extends Q{constructor(){super("Thingy52Control"),window.setTimeout(()=>{this.initialize()},0),this._onAccelChange=this._onAccelChange.bind(this),this._onButtonChange=this._onButtonChange.bind(this),this._devices=new Map}initialize(){}async scan(){try{const t=await navigator.bluetooth.requestDevice({filters:[{services:["ef680100-9b35-4933-9b10-52ffa9740042"]}],optionalServices:["ef680200-9b35-4933-9b10-52ffa9740042","ef680300-9b35-4933-9b10-52ffa9740042","ef680400-9b35-4933-9b10-52ffa9740042","ef680500-9b35-4933-9b10-52ffa9740042"]});this._attachDevice(t)}catch(t){console.log(t)}}_deviceDisconnected(t){console.log("Disconnected",t),this._devices.has(t.id)&&(this._devices.delete(t.id),this.emitDisconnected(t.id),this.emitMessage(t.id,""))}async _attachDevice(t){if(this._devices.has(t.id))return void console.log("Device already connected: ",t.id);const e=await t.gatt.connect();await this._startAccelerometerNotifications(e),await this._startButtonClickNotifications(e),this._devices.set(t.id,t),t.ongattserverdisconnected=e=>this._deviceDisconnected(t),this.emitConnected(t.id)}_onAccelChange(t){const e=t.target,i=e.service.device.id,s=+e.value.getFloat32(0,!0).toPrecision(5),n=+e.value.getFloat32(4,!0).toPrecision(5),o=(e.value.getFloat32(8,!0).toPrecision(5),Math.round(60+n)),r=Math.min(Math.max(0,Math.round(63-8*s)),this.MAX_VELOCITY);this._note==o&&this._velocity==r||(this._note=o,this._velocity=r,this.emitMessage(i,`Note #${this._note} @ vel ${this._velocity}`))}_onButtonChange(t){const e=t.target,i=e.service.device.id,s=1===e.value.getUint8(0);console.log(s?"NOTE_ON":"NOTE_OFF"),s?this._note&&(this.emitControlEvent(i,{type:tt,channel:0,note:this._note,velocity:this._velocity}),this._lastNote=this._note):this._lastNote&&this.emitControlEvent(i,{type:Z,channel:0,note:this._lastNote,velocity:this.MAX_VELOCITY})}async _startAccelerometerNotifications(t){const e=await t.getPrimaryService("ef680400-9b35-4933-9b10-52ffa9740042"),i=await e.getCharacteristic("ef68040a-9b35-4933-9b10-52ffa9740042");return i.addEventListener("characteristicvaluechanged",this._onAccelChange),i.startNotifications()}async _startButtonClickNotifications(t){const e=await t.getPrimaryService("ef680300-9b35-4933-9b10-52ffa9740042"),i=await e.getCharacteristic("ef680302-9b35-4933-9b10-52ffa9740042");return i.addEventListener("characteristicvaluechanged",this._onButtonChange),i.startNotifications()}_detachDevice(t){t.gatt.disconnect()}},dt=new class extends Q{constructor(){super("WebMIDIControl"),this._onMIDIEvent=this._onMIDIEvent.bind(this),this._onMIDIStateChange=this._onMIDIStateChange.bind(this),window.setTimeout(()=>{this.initialize()},0)}initialize(){navigator.requestMIDIAccess?navigator.requestMIDIAccess({sysex:!1}).then(t=>{this._midiaccess=t;let e=this._midiaccess.inputs.values();for(let t=e.next();t&&!t.done;t=e.next())console.log("midi input",t.value),t.value.onmidimessage=this._onMIDIEvent;this._midiaccess.onstatechange=this._onMIDIStateChange},t=>console.error("WebMIDI error: "+t)):console.error("WebMIDI not supported.")}_onMIDIEvent(t){this.emitControlEvent(t.currentTarget.id,this._toEvent(t.data))}_onMIDIStateChange(t){console.log("midi state change: ",t);let e=t.port;e instanceof MIDIInput&&("connected"===e.state?(this.emitConnected(e.id),e.onmidimessage=this._onMIDIEvent):"disconnected"===e.state&&this.emitDisconnected(e.id))}_toEvent(t){let e={};if(t&&t.length){switch(console.log(t),e.type=240&t[0],e.channel=240!=e.type?15&t[0]:void 0,e.type){case tt:case Z:case et:e.note=t[1],e.velocity=t[2];break;case it:e.control=t[1],e.value=t[2];break;case st:e.value=(t[2]<<7)+t[1]}e.type===tt&&0===t[2]&&(e.type=Z)}return e}};at.set(ct.controllerType,ct),at.set(ht.controllerType,ht),at.set(lt.controllerType,lt),at.set(dt.controllerType,dt);const ut=at;customElements.define("controller-settings",class extends J{constructor(){super(),this.onChange=this.onChange.bind(this);for(let[t,e]of ut)console.log("Controller registered:",t),e.addEventListener("connect",this.onChange),e.addEventListener("disconnect",this.onChange),e.addEventListener("message",this.onChange),e.addEventListener("midi-event",t=>console.log("midi-event",t.detail))}onChange(t){this.requestUpdate()}render(){return D`
          <style>
            :host {
              display: block;
              margin: 0.2em;
              background: #eee;
              -webkit-user-select: none;
              -moz-user-select: none;
              user-select: none;
              box-sizing: border-box;
            }
          </style>

          <ul>
          ${Array.from(ut).map(([t,e])=>D`<li>${t} (${e.devices.length}) - ${e.currentMessage}</li>`)}
          </ul>
        `}});customElements.define("mat-button",class extends J{render(){return D`
        <style>
          .btn {
            display: block;
            position: relative;
            box-sizing: border-box;
            min-width: 5.14em;
            margin: 0.2em;
            background: transparent;
            text-align: center;
            font: inherit;
            text-transform: uppercase;
            outline: none;
            border-radius: 5px;
            user-select: none;
            cursor: pointer;
            z-index: 0;
            padding: 0.7em 0.57em;
            box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
            background-color: var(--background-color, darkgray);
            color: white;
          }
          .btn:hover {
            box-shadow: 0 3px 3px 0 rgba(0,0,0,0.14), 0 1px 7px 0 rgba(0,0,0,0.12), 0 3px 1px -1px rgba(0,0,0,0.2);
            background-color: var(--background-color-hover, gray);
          }
        </style>
        <div class="btn">
          <slot></slot>
        </div>
      `}});customElements.define("sample-visualizer",class extends J{constructor(){super(),this._data=null,this.left=-1,this.right=-1,this._renderCanvas=this._renderCanvas.bind(this)}get data(){return this._data}set data(t){this._data=t,this._prepData(),requestAnimationFrame(this._renderCanvas)}showTrim(t,e){this.left=t,this.right=e,requestAnimationFrame(this._renderCanvas)}firstUpdated(){this.canvas=this.shadowRoot.getElementById("viz");const t=getComputedStyle(this);this.lineColor=t.getPropertyValue("--line-color")||"rgb(255,20,20)",this.backgroundColor=t.getPropertyValue("--background-color")||"rgb(50,10,10)",new ResizeObserver(t=>{for(let e of t){const t=e.contentRect;this._width=Math.ceil(t.width),this._height=Math.ceil(t.height),this.requestUpdate(),requestAnimationFrame(this._renderCanvas)}}).observe(this.shadowRoot.getElementById("vizdiv"))}_prepData(){if(this._data instanceof AudioBuffer)this.left=-1,this.right=-1,this._renderData=this._data.getChannelData(0);else{if(!(this._data instanceof Float32Array))return this._renderData=null,this._renderDataMax=0,void(this._renderDataMin=0);this._renderData=this._data}this._renderDataMax=this._renderData.reduce((t,e)=>Math.max(t,e)),this._renderDataMin=this._renderData.reduce((t,e)=>Math.min(t,e)),this._renderCanvas()}_renderCanvas(){const t=this.canvas.getContext("2d");t.fillStyle=this.backgroundColor,t.fillRect(0,0,this._width,this._height),t.strokeStyle=this.lineColor;const e=this._height/2,i=e;if(this._renderData){if(this._renderData.length<4*this._width){const s=this._width/this._renderData.length;let n=0;t.strokeStyle=this.lineColor,t.lineWidth=3,t.beginPath();for(let o of this._renderData)0===n?t.moveTo(n,e-i*o):t.lineTo(n,e-i*o),n+=s;t.stroke()}else{const e=Math.floor(this._renderData.length/this._width);t.fillStyle=this.lineColor;for(let s=0;s<this._width;s++){let n=1,o=-1;for(let t=0;t<e;t++){const i=this._renderData[s*e+t];i<n&&(n=i),i>o&&(o=i)}t.fillRect(s,(1+n)*i,1,Math.max(1,(o-n)*i))}}if(this.left>=0&&this.left<this.right&&this.right<this._renderData.length){const e=this._width/this._renderData.length;t.fillStyle="#FFFFFF20",t.fillRect(e*this.left,0,e*(this.right-this.left),this._height)}}}render(){return D`
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
    `}});customElements.define("main-app",class extends J{constructor(){super(),this.isRecording=!1,this.isTrimming=!1;const t=Math.pow(2,1/12);for(let[e,i]of ut)console.log("Controller registered:",e),i.addEventListener("connect",t=>console.log("connect",t.detail)),i.addEventListener("disconnect",t=>console.log("disconnect",t.detail)),i.addEventListener("midi-event",e=>{const i=e.detail.data;console.log("midi-event",nt[i.type],i),i.type===tt?G.playEffectNote(this._sample,Math.pow(t,i.note-60),i.note,i.velocity):i.type===Z&&G.stopNote(i.note)})}static get properties(){return{isRecording:{type:Boolean},isTrimming:{type:Boolean}}}_initRecording(){if(navigator.getUserMedia){let t={audio:!0,video:!1},e=[],i=t=>{this.mediaRecorder=new MediaRecorder(t,{mimeType:"audio/webm"}),this._visualize(t),this.mediaRecorder.onstop=async t=>{var i=new Blob(e,{type:"audio/webm"});e=[],this.lastRecordingBlob=i,this.lastRecording=await G.convertBlobToAudioBuffer(i),this.isRecording=!1},this.mediaRecorder.ondataavailable=t=>{e.push(t.data)}},s=t=>{console.log(t)};navigator.getUserMedia(t,i,s)}else console.log("getUserMedia is not supported!")}_recordToggle(){this.mediaRecorder&&(this.isRecording?this.mediaRecorder.stop():(this.mediaRecorder.start(),this.isRecording=!0))}get lastRecording(){return this._lastRecording}set lastRecording(t){this._lastRecording=t,this._lastRec.data=t,this._sample=t}_visualize(t){const e=G.ctx;let i=e.createMediaStreamSource(t),s=e.createAnalyser();s.fftSize=1024;let n=new Float32Array(s.fftSize);this._micSignal.data=n,i.connect(s);let o=()=>{requestAnimationFrame(o),s.getFloatTimeDomainData(n),this._micSignal.data=n};o()}render(){return D`
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
                ${this.isRecording?"Stop recording":"Start recording"}
              </mat-button>
              <mat-button @click=${this._doScanForEmpiriKit}>Scan for empiriKit</mat-button>
              <mat-button @click=${this._doScanForThingy52}>Scan for Thingy52</mat-button>
              <mat-button @click=${this._loadSound}>Load piano sound</mat-button>
              <mat-button .hidden=${!this.lastRecordingBlob} @click=${this._exportSound}>Export Recording</mat-button>
              <mat-button .hidden=${!this._lastRecording} ?active=${this.isTrimming} @click=${this._autoTrim}>
                ${this.isTrimming?"Select in recording":"Auto trim"}
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
    `}_doScanForEmpiriKit(){ut.get("EmpiriKitControl").scan()}_doScanForThingy52(){ut.get("Thingy52Control").scan()}_enableAudio(){G.ctx.resume(),this._initRecording()}async _loadSound(t){this.lastRecording=await G.loadSample("./assets/audio/piano_c.ogg"),this.lastRecordingBlob=void 0,this.requestUpdate()}_exportSound(){if(this.lastRecordingBlob){const t=document.createElement("a");t.download=`usbtronica-${Date.now()}.webm`,t.href=URL.createObjectURL(this.lastRecordingBlob),t.click()}}_autoTrim(){this._lastRecording&&(this.isTrimming=!this.isTrimming,this.isTrimming||(this._sample=this.lastRecording,this._lastRec.showTrim(-2)))}_clickInSample(t){if(this.lastRecording)if(this.isTrimming){const e=t.target.getBoundingClientRect(),i=(t.clientX-e.left)/e.width,s=this.lastRecording.getChannelData(0),n=.002,o=32,r=Math.round(s.length*i);let a=0,c=r;for(;a<o&&c>0;)Math.abs(s[c])<n?a++:a=0,c--;a=0;let h=r;for(;a<o&&h<s.length-1;)Math.abs(s[h])<n?a++:a=0,h++;this._lastRec.showTrim(c,h);const l=G.ctx.createBuffer(1,h-c,this.lastRecording.sampleRate),d=new Float32Array(h-c);this.lastRecording.copyFromChannel(d,0,c),l.copyToChannel(d,0,0),this._sample=l,this.isTrimming=!1}else G.playSample(this._sample)}firstUpdated(){this._micSignal=this.shadowRoot.querySelector("#micSignal"),this._lastRec=this.shadowRoot.querySelector("#lastRec")}});
//# sourceMappingURL=index.js.map
