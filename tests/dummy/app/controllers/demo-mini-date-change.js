import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

export default Ember.Controller.extend({
  duration: 60,
  numDateChoices: 4,
  myDate: null,

  actions: {
    onDateChange(date) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.success(`Date has changed to: ${date}`);
      this.set('myDate', date);
    }
  }

});
