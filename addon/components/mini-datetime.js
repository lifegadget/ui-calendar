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
  classNameBindings: ['actionSupport:action-support','_font', '_size'],
  // API Surface
  // -------------
  // one way interface
  value: computed.alias('startTime'),
  startTime: null,
  stopTime: null,
  duration: 60,
  // two way interfaces
  ampm: true,
  actionSupport: false,
  maxWidth: null,
  size: 'normal',
  font: 'inherit',
  showDuration: null,
  numDateChoices: 4,

  // Boolean flags
  durationIsSet: computed.bool('_duration'),

  // one-way proxies
  // ---------------
  _startTime: computed('startTime', {
    set: function(_,value) {
      return value;
    },
    get: function() {
      const startTime = this.get('startTime');

      return typeOf(startTime) === 'class' && startTime._isAMomentObject ? startTime : moment(this.get('startTime'));
    }
  }),
  _duration: computed('duration', {
    set: function(_,value) {
      return value;
    },
    get: function() {
      return this.get('duration');
    }
  }),
  _stopTime: computed('_duration','_startTime', function() {
    const {_duration, _startTime} = this.getProperties('_duration', '_startTime');
    return moment(_startTime).add(_duration, 'minutes');
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

  _durationPretty: computed('_duration', function() {
    const duration = this.get('_duration');
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
      const actionSupport = this.get('actionSupport');
      if(actionSupport) {
        this.set('changingTime', false);
        this.toggleProperty('changingDate');
      }
    },
    // Adds/removes the mini-date-time helper to the UI
    changeTime: function() {
      const actionSupport = this.get('actionSupport');
      if(actionSupport) {
        this.set('changingDate', false);
        this.toggleProperty('changingTime');
      }
    },
    onDateChange: function(yyyy,mm,dd) {
      const newDate = this.get('_startTime').clone().year(yyyy).month(mm - 1).date(dd);
      console.log('start time[%s,%s,%s]: %o', yyyy,mm,dd,newDate);
      this.set('_startTime', newDate);
      this.sendAction('onChange', 'date', {
        date: [yyyy, mm, dd],
        startTime: this.get('_startTime'),
        duration: this.get('_duration')
      });
    },
    onTimeChange: function(minutes) {
      const {_startTime} = this.getProperties('_startTime');
      const newStartTime = specifyMinuteOffset(_startTime, minutes);
      if(newStartTime.format(TIME_FORMAT) !== _startTime.format(TIME_FORMAT) ) {
        this.set('_startTime', newStartTime);
        this.sendAction('onChange', 'start-time', {
          startTime: newStartTime,
          oldStartTime: _startTime,
          stopTime: this.get('_stopTime'),
          duration: this.get('_duration')
        });
      }
    },
    onDurationChange: function(minutes) {
      console.log('duration changed: %sm', minutes);
      this.set('_duration', minutes);
      this.sendAction('onChange', 'duration', {
        duration: minutes,
        startTime: this.get('_startTime'),
        stopTime: this.get('_stopTime')
      });
    },
  }
});
