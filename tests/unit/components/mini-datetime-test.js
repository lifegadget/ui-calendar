import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line


moduleForComponent('mini-datetime', 'Unit | Component | mini-datetime', {
  // Specify the other units that are required for this test
  needs: ['helper:moment-format'],
  unit: true
});

test('it renders', function(assert) {
  assert.expect(1);
  // var component = this.subject();
  run(()=> {
    this.render();
    assert.equal(this.$('div').hasClass('mini-datetime'), true, 'render should have mini-datetime class');
  });
});
