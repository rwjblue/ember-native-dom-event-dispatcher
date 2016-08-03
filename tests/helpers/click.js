import { focus, fireEvent } from './events';

export default function click(selector, context=document.getElementById('ember-testing')) {
  let el = context.querySelector(selector);

  fireEvent(el, 'mousedown');

  focus(el);

  fireEvent(el, 'mouseup');
  fireEvent(el, 'click');
}
