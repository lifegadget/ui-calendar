import Ember from 'ember';
import moment from 'moment';
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
  numDateChoices: 4,
  duration: 0,
  start: moment().toISOString(),

  actions: {
    changeDuration(direction) {
      const o = {
        add: [15,30,45,60,90,120],
        remove: false
      };
      this.set('durationChoices', o[direction || 'add']);
    }
  }
});
