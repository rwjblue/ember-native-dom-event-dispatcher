import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { click, focus, blur } from 'ember-native-dom-helpers';
import Component from '@ember/component';

moduleForComponent('ember-native-dom-event-dispatcher - integration tests', {
  integration: true
});

test('a component can handle the click event', function(assert) {
  assert.expect(1);

  this.register('component:handles-click', Component.extend({
    click() {
      assert.ok(true, 'click was fired!');
    }
  }));

  this.register('template:components/handles-click', hbs`<button>Click me</button>`);

  this.render(hbs`{{handles-click id='clickey'}}`);

  click('#clickey');
});

test('actions are properly looked up when clicked directly', function(assert) {
  assert.expect(1);

  this.register('component:handles-click', Component.extend({
    actions: {
      handleClick() {
        assert.ok(true, 'click was fired!');
      }
    }
  }));

  this.register('template:components/handles-click', hbs`<button {{action 'handleClick'}}>Click me</button>`);

  this.render(hbs`{{handles-click id='clickey'}}`);

  click('button');
});

test('actions are properly looked up when clicking nested contents', function(assert) {
  assert.expect(1);

  this.register('component:handles-click', Component.extend({
    actions: {
      handleClick() {
        assert.ok(true, 'click was fired!');
      }
    }
  }));

  this.register('template:components/handles-click', hbs`<div {{action 'handleClick'}}><button>Click me</button></div>`);

  this.render(hbs`{{handles-click id='clickey'}}`);

  click('button');
});

test('unhandled events do not trigger an error', function(assert) {
  assert.expect(0);

  this.render(hbs`<button>Click Me!</button>`);

  click('button');
});

test('events bubble up', function(assert) {
  assert.expect(1);

  this.register('component:handles-focusout', Component.extend({
    focusOut() {
      assert.ok(true, 'focusOut was fired!');
    }
  }));

  this.register('component:input-element', Component.extend({
    tagName: 'input',

    focusOut() {}
  }));

  this.render(hbs`{{#handles-focusout}}{{input-element}}{{/handles-focusout}}`);

  focus('input');
  blur('input');
});

test('events are not stopped by default', function(assert) {
  assert.expect(2);

  this.on('submit', (e) => {
    e.preventDefault();
    assert.ok(true, 'submit was fired!');
  });

  this.register('component:submit-button', Component.extend({
    tagName: 'button',
    attributeBindings: ['type'],
    type: 'submit',
    click() {
      assert.ok(true, 'button was clicked!');
    }
  }));

  this.render(hbs`<form onsubmit={{action "submit"}}>{{submit-button}}</form>`);

  click('button');
});

test('events are stopped when returning false from view handler', function(assert) {
  assert.expect(1);

  this.on('submit', (e) => {
    e.preventDefault();
    assert.notOk(true, 'submit should not be fired!');
  });

  this.register('component:submit-button', Component.extend({
    tagName: 'button',
    attributeBindings: ['type'],
    type: 'submit',
    click() {
      assert.ok(true, 'button was clicked!');
      return false;
    }
  }));

  this.render(hbs`<form onsubmit={{action "submit"}}>{{submit-button}}</form>`);

  click('button');
});
