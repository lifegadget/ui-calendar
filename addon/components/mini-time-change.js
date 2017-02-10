import Ember from 'ember';
import ddau from 'ui-calendar/mixins/ddau';

const { keys, create } = Object; // jshint ignore:line
const { RSVP: {Promise} } = Ember; // jshint ignore:line
const { inject: {service} } = Ember; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line
import layout from '../templates/components/mini-time-change';
import moment from 'moment';

export default Ember.Component.extend(ddau, {
  layout: layout,
  classNames: ['ui-calendar','mini-time-change', 'noselect', 'floater'],
  /**
   * The time interval choices available in UI, if
   * null or false UI will not display duration at all
   */
  durationChoices: [30,45,60,90],
  _durationChoices: computed('durationChoices', function() {
    let choices = this.get('durationChoices');
    if(typeOf(choices) === 'string') {
      choices = choices.split(',');
    }

    return typeOf(choices) !== 'array' ? false : a(choices.map( choice => {
      return typeOf(choice) === 'object' ? choice : { title: `${choice}m`, value: Number(choice) };
    }));
  }),
  duration: null,
  /**
   * The current time that was set by the container
   */
  value: computed.alias('time'),
  time: null,
  _time: computed('time', function() {
    const {time, _start, _end, midPoint, timeDefault} = this.getProperties('time', 'midPoint', 'timeDefault');
    if(typeOf(time) === 'null' || typeOf(time) === 'undefined') {
      const suggestedTime = {
        left: _start,
        center: midPoint,
        right: _end
      };
      this.ddau('onTimeChange', suggestedTime[timeDefault], suggestedTime[timeDefault]);
    }
    else if(typeOf(time) === 'number') {
      return time;
    } else {
      let [hours, minutes] = time.split(':');
      return (hours * 60) + Number(minutes) - 1;
    }
  }),
  /**
   * Allows the slider and chevron buttons to immediately
   * make changes to an internal representation of the time
   * which is then passed up to the container as an action.
   */
  _shadowTime: computed('_time', {
    set(_, value) {
      return value;
    },
    get() {
      return this.get('_time');
    }
  }),
  timezone: 0,
  start: 0,
  _start: computed('start', function() {
    const start = this.get('start');
    if(typeOf(start) === 'number') {
      return start;
    } else {
      let [hours, minutes] = start.split(':');
      return (hours * 60) + Number(minutes) - 1;
    }
  }),
  end: 1439, // a tick for every minute in the day
  _end: computed('end', function() {
    const end = this.get('end');
    if(typeOf(end) === 'number') {
      return end;
    } else {
      let [hours, minutes] = end.split(':');
      return (hours * 60) + Number(minutes) - 1;
    }
  }),
  step: 15,
  chevronStep: 5,
  /**
   * The number of time-blocks that the slider will be reponsible
   * for managing between.
   */
  intervals: computed('_start', '_end', function() {
    const {_start, _end} = this.getProperties('_start', '_end');
    return Number(_end) - Number(_start);
  }),
  midPoint: computed('intervals', function() {
    return this.get('intervals') / 2;
  }),
  timeDefault: 'center', // if time is not set, then event fired to move it to middle of range [left, center, right]
  ticks: computed(() => ['0:00', '6:00', '12:00', '18:00', '23:59']),
  tickLabels: computed(() => ['', '6am','Noon', '6pm', '']),
  // parses CSV or array ticks input
  // returns a numeric values based on
  // configuration
  _ticks: computed('ticks', 'intervals', function() {
    const ticks = this.get('ticks');
    const t = typeOf(ticks) === 'string' ? ticks.split(',') : ticks;

    return t.map(tick => {
      const [hours, minutes] = tick.split(':');
      return Number(hours * 60) + Number(minutes);
    });
  }),

  tooltip(value) {
    return moment().startOf('day').add(value, 'minutes').format('h:mm a');
  },
  minedOut: computed('_start', '_shadowTime', function() {
    const {_start, _shadowTime} = this.getProperties('_start', '_shadowTime');
    return _shadowTime <= _start ? 'maxed-out' : null;
  }),
  maxedOut: computed('_end', '_shadowTime', function() {
    const {_end, _shadowTime} = this.getProperties('_end', '_shadowTime');
    return _shadowTime >= _end ? 'maxed-out' : null;
  }),

  actions: {
    timeChanged: function(value) {
      this.ddau('onTimeChange', value, value);
    },
    increaseTime: function() {
      let minutes = this.get('_shadowTime') + this.get('chevronStep');
      this.set('_shadowTime', minutes);
      this.ddau('onTimeChange', minutes, minutes);
    },
    decreaseTime: function() {
      const { _shadowTime, chevronStep } = this.getProperties('_shadowTime', 'chevronStep');
      let minutes = _shadowTime - chevronStep;
      this.set('_shadowTime', minutes);
      this.ddau('onTimeChange', minutes, minutes); 
    },
    onDurationChange: function(action, value) {
      if(value.values[0] !== this.get('duration')) {
        this.ddau('onDurationChange', value.values[0],value.values[0]);
      }
    },
  }

});
