import Ember from 'ember';
import moment from 'moment';
import SharedStyle from '../mixins/shared-style';
const TIME_FORMAT = 'HH:mm:ss';
const { computed, observer, $, A, run, on, typeOf, debug, keys, get, set, inject } = Ember;    // jshint ignore:line
const getMoment = (thingy, minutes) => {
  switch(typeOf(thingy)) {
    case 'string':
      thingy = moment(thingy);
      break;
    case 'number':
      thingy = moment.unix(thingy);
      break;
    case 'object':
    case 'instance':
      thingy = thingy.clone();
      break;
    default:
      debug(`unexpected type sent in as moment source: ${typeOf(thingy)}`);
      return null;
  }
  if(minutes) {
    thingy.add(minutes,'minutes');
  }

  return thingy;
};
const getMomentDiff = (a,b) => {
  return Math.abs(moment(a).diff(moment(b), 'minutes'));
};
const getMinutes = m => {
  return m.diff(m.clone().startOf('day'),'minutes');
  };
const getDuration = (thingy, context) => {
  switch(typeOf(thingy)) {
    case 'number':
      break;
    case 'null':
    case 'undefined':
      const startTime = context ? context.get('_startTime') : null;
      const stopTime = context ? context.get('_stopTime') : null;
      if(context && startTime !== null && stopTime !== null) {
        thingy = getMomentDiff(startTime, stopTime);
      } else {
        thingy = null;
      }
      break;
    default:
      thingy = null;
  }

  return thingy;
};
const specifyMinuteOffset = (day, minutes) => {
  return day ? day.clone().startOf('day').add(minutes, 'minutes') : null;
};

import layout from '../templates/components/mini-datetime';

export default Ember.Component.extend(SharedStyle,{
  // API Surface
  // -------------
  // one way interface
  value: computed.alias('startTime'),
  startTime: null,
  stopTime: null,
  duration: null,
  // two way interfaces
  ampm: true,
  actionSupport: false,
  maxWidth: null,
  size: 'normal',
  font: computed.alias('fontFamily'),
  showDuration: null,
  numDateChoices: 4,

  // one-way proxies
  // ---------------
  _startTime: computed('startTime', {
    // internal set
    set: function(index,value) {
      return getMoment(value);
    },
    // reaction to external state change
    get: function() {
      return getMoment(this.get('startTime'));
    }
  }),
  _stopTime: computed('stopTime','duration', '_duration', {
    // internal set
    set: function(index,value) {
      return getMoment(value);
    },
    // reaction to external state change
    get: function() {
      const stopTime = this.get('stopTime');
      const { _startTime, _duration } = this.getProperties('_startTime', '_duration');
      // prefer sourcing from explicit stopTime but derive if necessary
      return stopTime ? getMoment(stopTime) : getMoment(_startTime, _duration);
    }
  }),
  _duration: computed('duration','stopTime', {
    // internal set
    set: function(index,value) {
      return getDuration(value);
    },
    // reaction to external state change
    get: function() {
      const duration = this.get('duration');
      const startTime = this.get('startTime');
      const stopTime = this.get('stopTime');

      return duration ? getDuration(duration) : getMomentDiff(startTime, stopTime);
    }
  }),
  // end one-way proxies
  // -------------------

  layout: layout,
  classNames: ['ui-calendar'],
  classNameBindings: ['actionSupport:action-support'],
  attributeBindings: ['_style:style'],

  _timeFormat: computed('ampm', function() {
    return this.get('ampm') ? 'h:mm' : 'H:mm';
  }),
  _size: on('init',computed('size', function() {
    const size = this.get('size');
    return size === 'default' || size === null ? null : `font-${size}`;
  })),
  // Duration versus Stop Time Logic
  _showDuration: on('init', computed('showDuration','duration','stopTime', function() {
    const { showDuration, duration, stopTime } = this.getProperties('showDuration', 'duration', 'stopTime');
    if(showDuration !== null) {
      return showDuration; // UI style has been explicitly stated
    } else {
      // detect usage
      const {_stopTime,_startTime} = this.getProperties('_stopTime', '_startTime');
      const daysApart = _startTime && _stopTime ? Math.abs(_startTime.diff(_stopTime,'days',true)) : -1;
      if(duration && !stopTime) {
        return true;
      } else if(stopTime && !duration) {
        return daysApart > 1 ? true : false; // long durations always described in duration terminology
      } else if(!stopTime && !duration) {
        return false;
      }

      debug('mini-datetime recieved a duration AND a stopTime; typically you should use one or the other not both.');
      return true;
    }
  })),
  _showStopTime: computed('showDuration', '_duration','_stopTime', function() {
    const showDuration = this.get('showDuration');
    const _showDuration = this.get('_showDuration');
    if(showDuration !== false) {
      return !_showDuration;
    }

    return true;
  }),

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
    changeDate: function() {
      const actionSupport = this.get('actionSupport');
      if(actionSupport) {
        this.set('changingTime', false);
        this.toggleProperty('changingDate');
      }
    },
    changeTime: function() {
      const actionSupport = this.get('actionSupport');
      if(actionSupport) {
        this.set('changingDate', false);
        this.toggleProperty('changingTime');
      }
    },
    dateChanged: function(yyyy,mm,dd) {
      const startTime = this.get('_startTime');
      this.set('_startTime', startTime.clone().year(yyyy).month(mm - 1).date(dd));
      this.sendAction('dateChanged', yyyy, mm, dd);
    },
    timeChanged: function(minutes) {
      const {_startTime, _duration} = this.getProperties('_startTime', '_duration');
      const newStartTime = specifyMinuteOffset(_startTime, minutes);
      const newStopTime=specifyMinuteOffset(newStartTime, _duration + getMinutes(newStartTime));
      if(newStartTime.format(TIME_FORMAT) !== _startTime.format(TIME_FORMAT) ) {
        this.set('_startTime', newStartTime);
        this.set('_stopTime', newStopTime);
        this.sendAction('timeChanged', newStopTime.format('HH'), newStopTime.format('mm'), newStopTime.format('ss'));
      }
    },
    durationChanged: function(minutes) {
      const _startTime = this.get('_startTime');
      const _stopTime = getMoment(_startTime, minutes);
      this.set('_duration', minutes);
      this.notifyPropertyChange('_duration');
      this.set('_stopTime', _stopTime);
      this.sendAction('timeChanged', _stopTime.format('HH'), _stopTime.format('mm'), _stopTime.format('ss'));
    },
  }
});
