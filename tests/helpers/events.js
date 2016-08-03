/* globals Element */

import Ember from 'ember';

const {
  $: jQuery,
  run,
  assign
} = Ember;

const DEFAULT_EVENT_OPTIONS = { canBubble: true, cancelable: true };
const KEYBOARD_EVENT_TYPES = ['keydown', 'keypress', 'keyup'];
const MOUSE_EVENT_TYPES = ['click', 'mousedown', 'mouseup', 'dblclick', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover'];

export const elMatches = typeof Element !== 'undefined' &&
  (Element.prototype.matches ||
   Element.prototype.matchesSelector ||
   Element.prototype.mozMatchesSelector ||
   Element.prototype.msMatchesSelector ||
   Element.prototype.oMatchesSelector ||
   Element.prototype.webkitMatchesSelector);

export function matches(el, selector) {
  return elMatches.call(el, selector);
}

export function focus(el) {
  if (!el) { return; }
  if (matches(el, 'input, textarea, select, button, [contenteditable=true]')) {
    let type = el.type;
    if (type !== 'checkbox' && type !== 'radio' && type !== 'hidden') {
      run(function() {
        // Firefox does not trigger the `focusin` event if the window
        // does not have focus. If the document doesn't have focus just
        // use trigger('focusin') instead.

        if (!document.hasFocus || document.hasFocus()) {
          el.focus();
        } else if (jQuery) {
          let $el = jQuery(el);
          $el.trigger('focusin');
        }
      });
    }
  }
}

export function fireEvent(element, type, options = {}) {
  if (!element) {
    return;
  }
  let event;
  if (KEYBOARD_EVENT_TYPES.indexOf(type) > -1) {
    event = buildKeyboardEvent(type, options);
  } else if (MOUSE_EVENT_TYPES.indexOf(type) > -1) {
    let rect = element.getBoundingClientRect();
    let x = rect.left + 1;
    let y = rect.top + 1;
    let simulatedCoordinates = {
      screenX: x + 5,
      screenY: y + 95,
      clientX: x,
      clientY: y
    };
    event = buildMouseEvent(type, assign(simulatedCoordinates, options));
  } else {
    event = buildBasicEvent(type, options);
  }
  element.dispatchEvent(event);
}

function buildBasicEvent(type, options = {}) {
  let event = document.createEvent('Events');
  event.initEvent(type, true, true);
  assign(event, options);
  return event;
}

function buildMouseEvent(type, options = {}) {
  let event;
  try {
    event = document.createEvent('MouseEvents');
    let eventOpts = assign({}, DEFAULT_EVENT_OPTIONS, options);
    event.initMouseEvent(
      type,
      eventOpts.canBubble,
      eventOpts.cancelable,
      window,
      eventOpts.detail,
      eventOpts.screenX,
      eventOpts.screenY,
      eventOpts.clientX,
      eventOpts.clientY,
      eventOpts.ctrlKey,
      eventOpts.altKey,
      eventOpts.shiftKey,
      eventOpts.metaKey,
      eventOpts.button,
      eventOpts.relatedTarget);
  } catch (e) {
    event = buildBasicEvent(type, options);
  }
  return event;
}

function buildKeyboardEvent(type, options = {}) {
  let event;
  try {
    event = document.createEvent('KeyEvents');
    let eventOpts = assign({}, DEFAULT_EVENT_OPTIONS, options);
    event.initKeyEvent(
      type,
      eventOpts.canBubble,
      eventOpts.cancelable,
      window,
      eventOpts.ctrlKey,
      eventOpts.altKey,
      eventOpts.shiftKey,
      eventOpts.metaKey,
      eventOpts.keyCode,
      eventOpts.charCode
    );
  } catch (e) {
    event = buildBasicEvent(type, options);
  }
  return event;
}
