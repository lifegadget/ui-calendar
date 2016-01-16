import Ember from 'ember';
import moment from 'moment';
import SharedStylist from 'ember-cli-stylist/mixins/shared-stylist';
const TIME_FORMAT = 'HH:mm:ss';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line
const specifyMinuteOffset = (day, minutes) => {
  return day ? day.clone().startOf('day').add(minutes, 'minutes') : null;
};

import layout from '../templates/components/mini-datetime';

export default Ember.Component.extend(SharedStylist,{
  layout: layout,
  classNames: ['ui-calendar','noselect'],
  classNameBindings: ['editable:action-support','_font', '_size'],

  ampm: true,
  editable: false,
  maxWidth: null,
  size: 'normal',
  font: 'inherit',
  showDuration: null,
  numDateChoices: 4,
  durationIsSet: computed.bool('duration'),

  /**
   * START (alias VALUE)
   *
   * Expects either a ISO string representing date and time or
   * a momentjs object
   */
  value: computed.alias('start'),
  start: null,
  // Internal working state is always a ISO string representation
  _start: computed('start', function() {
    const start = this.get('start') || moment().toISOString();
    return typeOf(start) === 'string' ? start : start.toISOString();
  }),
  _startMinutes: computed('_start', function() {
    const start = moment(this.get('_start'));
    return start.hours() * 60 + start.minutes();
  }),
  _startDate: computed('_start', function() {
    return moment(this.get('_start')).format('YYYY-MM-DD');
  }),
  /**
   * DURATION
   *
   * duration is expected to be an integer value, indicating "minutes"
   * that the said activity has/will be for
   */
  duration: 0,
  _stop: computed('duration','_startTime', function() {
    const {duration, _start} = this.getProperties('duration', '_start');
    return moment(_start).add(duration, 'minutes').toISOString();
  }),
  _stopTime: computed('_stop', function() {
    return moment(this.get('_stop')).format('H:mm');
  }),
  _stopDate: computed('_stop', function() {
    return moment(this.get('_stop')).format('YYYY-MM-DD');
  }),

  _timeFormat: computed('ampm', function() {
    return this.get('ampm') ? 'h:mm' : 'H:mm';
  }),
  _size: on('init',computed('size', function() {
    const size = this.get('size');
    return size === 'default' || size === null ? null : `size-${size}`;
  })),
  _font: on('init',computed('font', function() {
    const font = this.get('font');
    return font === 'default' || font === null ? null : `font-${font}`;
  })),

  durationPretty: computed('duration', function() {
    const duration = this.get('duration');
    const hour = 60;
    const dayThreashold = hour * 24;
    if(duration > dayThreashold) {
      const precise = duration % dayThreashold === 0 ? '' : '+';
      return Math.floor(duration/dayThreashold) + precise + ' days';
    } else if (duration % hour === 0) {
      const inflector = duration/hour === 1 ? '' : 's';
      return  duration / hour + ' hour' + inflector;
    } else {
      return  duration + ' minutes';
    }
  }),

  // ACTIONS
  actions: {
    // Adds/removes the mini-date-change helper to the UI
    changeDate: function() {
      const editable = this.get('editable');
      if(editable) {
        this.set('changingTime', false);
        this.toggleProperty('changingDate');
      }
    },
    // Adds/removes the mini-date-time helper to the UI
    changeTime: function() {
      const editable = this.get('editable');
      if(editable) {
        this.set('changingDate', false);
        this.toggleProperty('changingTime');
      }
    },
    onDateChange: function(date) {
      const newDateTime = moment(date).startOf('day').add(this.get('_startMinutes'), 'minutes');
      const startType = typeOf(this.get('start'));
      const _start = this.get('_start');
      this.attrs.onChange(
        startType === 'string' ? newDateTime.toISOString() : newDateTime, // new value
        startType === 'string' ? _start : moment(_start)
      );
    },
    onTimeChange: function(minutes) {
      const _start = this.get('_start');
      const newDateTime = moment(_start).startOf('day').add(minutes, 'minutes');
      const startType = typeOf(this.get('start'));
      this.attrs.onChange(
        startType === 'string' ? newDateTime.toISOString() : newDateTime, // new value
        startType === 'string' ? _start : moment(_start)
      );
    },
    onDurationChange: function(minutes) {
      const duration = this.get('duration');
      if(this.attrs.onDurationChange) {
        this.attrs.onDurationChange(
          minutes,  // new
          duration  // old
        );
      } else {
        debug(`duration changed from "${duration}" to "${minutes}" but the container did not have a "onDurationChange" action handler.`);
      }
    },
  }
});
