import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

const htmlSafe = Ember.String.htmlSafe;

export default Ember.Controller.extend({
  duration: 60,
  numDateChoices: 4,

  actions: {
    onDateChange(hash) {
      const flashMessages = Ember.get(this, 'flashMessages');
      const message = htmlSafe(`Date was changed to: <b>${hash.newValue}</b> <i>from</i> <b>${hash.oldValue}</b>`);

      if(hash.code === 'suggested-default') {
        flashMessages.warning(htmlSafe(`Default value was set to <b>${hash.newValue}</b> based on default setting of "${hash.defaultValue}"`));
      } else {
        flashMessages.success(message);
      }
      this.set('myDate', hash.newValue);
    }
  }

});
