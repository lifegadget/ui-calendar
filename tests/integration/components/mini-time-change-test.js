import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
// import Ember from 'ember';
// import moment from 'moment';

moduleForComponent('mini-time-change', 'Integration | Component | mini-time-change', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{mini-time-change}}`);

  assert.equal(this.$('div').hasClass('mini-time-change'), true, 'render should have mini-time-change class');
});
