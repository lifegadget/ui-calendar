import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import moment from 'moment';

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


test('time and duration changes do not effect container\'s values but actions are fired with updated values', function(assert) {
  assert.expect(8);

  var time = '2015-05-04 14:30';
  var aMinuteLater = moment(time).add(1,'minute').diff(moment(time).startOf('day'),'minutes');
  this.set('time', time);
  this.on('onTimeChange', (val) => assert.equal(val, aMinuteLater, 'onTimeChange event fired and have a value which is one greater.'));
  var duration = 45;
  this.set('duration', duration);
  this.on('onDurationChange', (val) => assert.equal(val, 90, 'onDurationChange event fired, value has been updated.'));

  this.render(hbs`{{mini-time-change
    time=time
    duration=duration
    durationChoices='30,45,60,90'
    onTimeChange='onTimeChange'
    onDurationChange='onDurationChange'
  }}`);
  assert.equal(this.get('time'), time, 'time is unchanged after initialisation');
  assert.equal(this.get('duration'), duration, 'duration is unchanged after initialisation');

  this.$().find('.increase-time').click();
  Ember.run( () => {
    assert.equal(this.get('time'), time, 'time remains unchanged after click event');
  });

  Ember.run( () => {
    assert.equal(this.$().find('.ui-button.btn.active').text().trim(),'45m', 'active button prior to click is 45m');
    this.$().find('.ui-button.btn')[3].click();
    Ember.run.next( () => {
      assert.equal(this.get('time'), time, 'duration remains unchanged after click event');
      assert.equal(this.$().find('.ui-button.btn.active').text().trim(),'90m', 'active button after click has been updated');
    });
  });

});
