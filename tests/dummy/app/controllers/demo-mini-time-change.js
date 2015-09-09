import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

export default Ember.Controller.extend({
  duration: 60,

  actions: {
    onTimeChange(time) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.success(`Start time has changed to: ${time}`);
    },
    onDurationChange(duration) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.info(`Duration has changed to: ${duration}`);
    }
  }

});
