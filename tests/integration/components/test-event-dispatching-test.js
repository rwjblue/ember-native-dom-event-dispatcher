import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import click from '../../helpers/click';

const {
  Component
} = Ember;

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

test('actions are properly looked up', function(assert) {
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
