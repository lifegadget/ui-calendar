import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
const getMinutes = m => m.diff(m.clone().startOf('day'),'minutes');

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

test('receives a change-time action', function(assert) {
  assert.expect(2);
  var dateString = '2015-05-04 14:45:00';
  var minutes = getMinutes(moment(dateString));

  this.on('onTimeChange', function(newMinutes) {
    assert.equal(newMinutes, minutes + 1, 'clicking on right chevron has increased minutes by one');
  });
  this.render(hbs`
    {{mini-datetime value=dateString onTimeChange='onTimeChange'}}
  `);

  this.$('.display.time').click();
  run.next(()=> {
    assert.equal(this.$('.increase-time').length, 1, 'increase-time button is available');
    this.$('.increase-time').click();
  });

});
