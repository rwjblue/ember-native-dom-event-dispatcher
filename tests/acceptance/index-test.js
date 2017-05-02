import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import hbs from 'htmlbars-inline-precompile';
import { click } from 'ember-native-dom-helpers';
import hasEmberVersion from 'ember-test-helpers/has-ember-version';

const {
  Component
} = Ember;

moduleForAcceptance('Acceptance | index', {
  beforeEach() {
    this.register = (...args) => {
      this.application.__deprecatedInstance__.register(...args);
    };
  }
});

if (hasEmberVersion(2, 13)) {
  test('visiting /', function(assert) {
    this.register('component:handles-click', Component.extend({
      click() {
        assert.ok(true, 'click was fired!');
      }
    }));

    this.register('template:components/handles-click', hbs`<button>Click me</button>`);
    this.register('template:index', hbs`{{handles-click id='clickey'}}`);

    visit('/');

    return andThen(function() {
      return click('#clickey');
    });
  });

  test('a component can handle the click event', function(assert) {
    assert.expect(1);

    this.register('component:handles-click', Component.extend({
      click() {
        assert.ok(true, 'click was fired!');
      }
    }));
    this.register('template:components/handles-click', hbs`<button>Click me</button>`);
    this.register('template:index', hbs`{{handles-click id='clickey'}}`);

    visit('/');

    return andThen(function() {
      return click('#clickey');
    });
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

    this.register('template:index', hbs`{{handles-click id='clickey'}}`);

    visit('/');

    return andThen(() => click('button'));
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

    this.register('template:index', hbs`{{handles-click id='clickey'}}`);

    visit('/');

    return andThen(() => click('button'));
  });

  test('unhandled events do not trigger an error', function(assert) {
    assert.expect(0);

    this.register('template:index', hbs`<button>Click Me!</button>`);

    visit('/');

    return andThen(() => click('button'));
  });
}
