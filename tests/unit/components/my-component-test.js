import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('my-component', 'Unit | Component | my component', {
  unit: true,
});

test('it works', function(assert) {
  let component = this.subject();

  assert.ok(component);
});
