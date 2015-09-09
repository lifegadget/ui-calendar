import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

import hbs from 'htmlbars-inline-precompile';
import moment from 'moment'; // jshint ignore:line
const getMinutes = m => m.diff(m.clone().startOf('day'),'minutes'); // jshint ignore:line

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

test('clicking time UI with actionSupport on brings up mini-change-time', function(assert) {
  assert.expect(3);
  var dateString = '2015-05-04 14:45:00';
  this.set('dateString', dateString);
  // var minutes = getMinutes(moment(dateString));

  this.render(hbs`
    {{mini-datetime value=dateString onTimeChange='onTimeChange' actionSupport=true}}
  `);

  assert.equal(this.$('.display.time').length, 1, 'PREP: .display.time selector is available');
  this.$('.display.time').click();
  run.next(()=> {
    console.log(this.$('.mini-time-change'));
    assert.equal(this.$('.increase-time').length, 1, 'increase-time button is available');
    assert.equal(this.$('.decrease-time').length, 1, 'decrease-time button is available');
  });

});
