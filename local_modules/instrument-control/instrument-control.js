// @ts-check

// Collects all controllers

import {EmpiriKitControl} from './empirikit-control.js';
import {KeyboardControl} from './keyboard-control.js';
import {Thingy52Control} from './thingy52-control.js';
import {WebMIDIControl} from './webmidi-control.js';

const _controllers = new Map();

const _empiriKitControl = new EmpiriKitControl();
const _keyboardControl = new KeyboardControl();
const _thingy52Control = new Thingy52Control();
const _webMIDIControl = new WebMIDIControl();

_controllers.set(_empiriKitControl.controllerType, _empiriKitControl);
_controllers.set(_keyboardControl.controllerType, _keyboardControl);
_controllers.set(_thingy52Control.controllerType, _thingy52Control);
_controllers.set(_webMIDIControl.controllerType, _webMIDIControl);

export const Controllers = _controllers;