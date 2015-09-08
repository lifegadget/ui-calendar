import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('mini-date-change', 'Integration | Component | mini-date-change', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{mini-date-change}}`);

  assert.equal(this.$('div').hasClass('mini-date-change'), true, 'render should have mini-date-change class');
});
