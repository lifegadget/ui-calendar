import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

export default Ember.Controller.extend({
  queryParams: ['containerSize','fontSize','fontFamily','actionSupport'],

  containerSize:false,
  fontSize: 'default',
  fontFamily: 'inherit',
  ampm: true,
  disabled: false,
  editable: true,
  actionSupport: true,
  durationChoices: [15,30,45,60,90,120],
  start: '2016-01-10 12:00:00',

  actions: {
    onTimeChange(datetime) {
      this.set('start', datetime);
    },
    onDurationChange(duration) {
      this.set('duration', duration);
    },
    onDateChange(datetime) {
      this.set('start', datetime);
    },
    changeDuration(direction) {
      const o = {
        add: [15,30,45,60,90,120],
        remove: false
      };
      this.set('durationChoices', o[direction]);
    }
  }
});
