import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line
import layout from '../templates/components/mini-time-change';
import moment from 'moment';
const calculateMinutesBlock = function(context) {
  if(context) {
    const minutes = context.get('minutes');
    const minutesPerBlock = context.get('minutesPerBlock');
    return Math.floor(minutes / minutesPerBlock);
  }

  return null;
};
const getMinutesInDay = thingy => {
  switch(typeOf(thingy)) {
    case 'number':
      break; // appears to already be minutes
    case 'undefined':
    case 'null':
      thingy = 0; // unspecified defaults to stroke of midnight (could make it current time but more expensive)
      break;
    case 'string':
      thingy = moment(thingy); // jshint ignore:line
    case 'object':
      thingy = thingy.diff(thingy.clone().startOf('day'),'minutes'); // assumes its a moment object
      break;
  }

  return thingy;
};

export default Ember.Component.extend({
  layout: layout,
  classNames: ['ui-calendar','mini-time-change', 'noselect', 'floater'],
  durationChoices: [30,45,60,90,120],

  value: computed.alias('time'),
  time: null,
  minutes: computed('time', {
    // handles internal state changes
    set: function(prop, value) {
      return getMinutesInDay(value);
    },
    // handles external state changes (aka, changes to 'time' dependency)
    get: function() {
      return getMinutesInDay(this.get('time'));
    }
  }),
  _minutesObserver: observer('minutes', function() {
    const minutes = this.get('minutes');
    this.sendAction('onTimeChange', minutes);
  }),
  duration: null,
  displayDuration: computed('duration', function() {
    return this.get('duration') !== false;
  }),
  _duration: computed('duration', {
    set: function(prop, value) {
      return value;
    },
    get: function() {
      const duration = this.get('duration');
      return typeOf(duration) === 'number' ? duration : 0;
    }
  }),
  _durationObserver: observer('_duration', function() {
    const duration = this.get('_duration');
    this.sendAction('onDurationChange', duration);
  }),
  _durationChoices: computed(function() {
    let choices = this.get('durationChoices');
    if(typeOf(choices) === 'string') {
      choices = choices.split(',');
    }
    if(typeOf(choices) !== 'array') {
      debug('durationChoices must be set to an array value!');
      return [];
    }

    return choices.map( choice => {
      return typeOf(choice) === 'object' ? choice : { title: `${choice}m`, value: Number(choice) };
    });
  }),
  minutesBlock: computed('minutes', {
    // explicit changes from slider control
    set: function(index,value) {
      const minutes = value * this.get('minutesPerBlock');
      // TODO: investigate if there's a way to NOT have this side effect in the CP setter
      this.set('minutes', minutes);
      return value;
    },
    // implicit updates coming from changes to minutes
    get: function() {
      return calculateMinutesBlock(this);
    }
  }),
  minutesPerBlock: 30,
  numberOfBlocks: computed('minutesPerBlock', function() {
    const minutesPerBlock = this.get('minutesPerBlock');
    return (60 * 24) / minutesPerBlock - 1;
  }),
  actions: {
    increaseTime: function() {
      let minutes = this.get('minutes') + 1;
      this.set('minutes', minutes);
    },
    decreaseTime: function() {
      let minutes = this.get('minutes') - 1;
      this.set('minutes', minutes);
    },
    // same thing but for a change in duration
    onDurationChange: function(action, values) {
      let minutes = values.pop(); // values are an array but in this case a single element array
      if(action === 'values') {
        this.set('_duration', minutes);
      }
    },
  }

});
