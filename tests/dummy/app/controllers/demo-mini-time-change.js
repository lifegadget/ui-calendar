import Ember from 'ember';
import moment from 'moment';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

export default Ember.Controller.extend({
  duration: 60,
  myTime: '12:35',

  actions: {
    onTimeChange(time) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.success(`Start time has changed to: ${time}`);
      this.set('myTime', moment().startOf('day').add(time + 1, 'minutes').format('H:mm'));
    },
    onDurationChange(duration) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.info(`Duration has changed to: ${duration}`);
      this.set('duration', duration);
    }
  }

});
