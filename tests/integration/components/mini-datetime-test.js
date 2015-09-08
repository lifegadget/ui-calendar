import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('mini-datetime', 'Integration | Component | mini-datetime', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{mini-datetime}}`);

  assert.equal(this.$('div').hasClass('mini-datetime'), true, 'render should have mini-datetime class');
});
