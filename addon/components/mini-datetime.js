import Ember from 'ember';
const { computed, observer, $, A, run, on, typeOf, debug, keys, get, set, inject } = Ember;    // jshint ignore:line

import layout from '../templates/components/mini-datetime';

export default Ember.Component.extend({
  layout: layout,
  classNames: ['ui-calendar', 'mini-datetime', 'flexy'],
  classNameBindings: ['_size'],
  value: null,
  size: null,
  _size: on('init',computed('size', function() {
    const size = this.get('size');
    return size === 'default' ? '' : `font-${size}`;
  })),
  // use either duration or stopTime, not both
  duration: null, // measured in # of minutes
  stopTime: null,
  // allows for explict setting of
  useDuration: null,
  _useDuration: computed('useDuration','duration','stopTime', function() {
    const { useDuration, duration, stopTime } = this.getProperties('useDuration', 'duration', 'stopTime');
    if(useDuration !== null) {
      return useDuration;
    } else {
      // detect usage
      if(duration && stopTime) {
        debug('mini-datetime recieved a duration AND a stopTime; use one or the other not both.');
        return true;
      }
    }
    return this.get('duration') ? true : false;
  })
});
