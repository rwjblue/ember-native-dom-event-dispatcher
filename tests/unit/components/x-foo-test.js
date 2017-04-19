import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('x-foo', 'Unit | Component | x foo', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('it doesn\'t breaks', function(assert) {
  assert.expect(0);
  this.subject();
  this.render();
});
