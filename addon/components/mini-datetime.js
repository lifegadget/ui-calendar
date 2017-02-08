import Ember from 'ember';
import moment from 'moment';
import SharedStylist from 'ember-cli-stylist/mixins/shared-stylist';
import ddau from 'ui-calendar/mixins/ddau';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

import layout from '../templates/components/mini-datetime';

const datetime = Ember.Component.extend(ddau, SharedStylist,{
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
  datetime: computed.alias('start'),
  start: null,
  _start: computed('start', function() {
    return moment(this.get('start'));
  }),
  // Internal working state of time aspects of datetime
  startMinutes: computed('start', {
    set(_, value) {
      const datetime = this.combine(this.get('startDate'), value);
      this.ddau('onDateChange', datetime, datetime);
      return value;
    },
    get() {
      return this.getMinutes(this.get('start'));
    }
  }),

  startDate: computed('start', function() {
    const start = this.get('start');
    return moment(start).format('YYYY-MM-DD');
  }),

  /**
   * DURATION
   *
   * duration is expected to be an integer value, indicating
   * "minutes" that the said activity spans
   */
  duration: 0,
  _stop: computed('_start', 'duration', function() {
    const {duration, _start} = this.getProperties('duration', '_start');
    return moment(_start).add(duration, 'minutes').toISOString();
  }),
  _stopTime: computed('_start','_stop','duration', function() {
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
  getMinutes(datetime) {
    const m = moment(this.convertFormat(datetime));
    return m.hours() * 60 + m.minutes();
  },
  convertFormat(f) {
    switch(typeOf(f)) {
      case 'string':
        this.format = f.indexOf('-') !== -1 ? 'string' : 'unix';
        return f.indexOf('-') !== -1 ? f : moment(f).toISOString();
      case 'object':
        this.format = 'object';
        return f.toISOString();
      case 'number':
        this.format = 'unix';
        return moment(f).toISOString();

      default:
        debug('unknown format passed in as date/time');
        return false;
    }
  },
  convertFormatBack(o) {
    switch(this.format) {
      case 'string':
        return o.toISOString();
      case 'object':
        return moment(o.toISOString());
      case 'unix':
        return o.toUnix();

      default:
        debug('can not convert back to unknown format ');
        return false;
    }
  },
  /**
   * Takes date and time as inputs and combines into a singular
   * form for both. The format of the returned value will match
   * the format that the container sent the data in as.
   */
  combine(date, minutes) {
    const combined = moment(date).add(minutes, 'minutes');
    return this.convertFormatBack(combined);
  },

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
    onDateChange: function(hash) {
      const newDateTime = moment(hash.newValue).startOf('day').add(this.get('startMinutes'), 'minutes');
      const formatted = this.convertFormatBack(newDateTime);

      this.ddau('onDateChange', formatted, formatted);
      this.ddau('onChange', formatted, formatted);
    },
    onTimeChange: function(minutes) {
      const combined = this.combine(this.get('startDate'), minutes);
      this.ddau('onTimeChange', combined, combined);
      this.ddau('onChange', combined, combined);
    },
    onDurationChange: function(minutes) {
      this.ddau('onDurationChange', minutes, minutes);
    },
  }
});

datetime[Ember.NAME_KEY] = 'mini-datetime';
export default datetime;
