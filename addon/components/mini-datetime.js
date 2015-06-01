import Ember from 'ember';
import moment from 'moment';
const { computed, observer, $, A, run, on, typeOf, debug, keys, get, set, inject } = Ember;    // jshint ignore:line
const htmlSafe = Ember.String.htmlSafe;
const styleProperties = ['_styleFontFamily', '_styleMaxWidth'];

import layout from '../templates/components/mini-datetime';

export default Ember.Component.extend({
  layout: layout,
  classNames: ['ui-calendar'],
  classNameBindings: ['actionSupport:action-support'],
  attributeBindings: ['_style:style'],
  value: null,
  size: null,
  ampm: true,
  actionSupport: false,
  _timeFormat: computed('ampm', function() {
    return this.get('ampm') ? 'h:mm' : 'H:mm';
  }),
  _size: on('init',computed('size', function() {
    const size = this.get('size');
    return size === 'default' ? '' : `font-${size}`;
  })),
  // use either duration or stopTime, not both
  duration: null, // measured in # of minutes
  _duration: computed('duration', function() {
    const { duration, stopTime, value } = this.getProperties('duration','stopTime', 'value');
    const calcDuration = (start,stop) => {
      return Math.abs(moment(start).diff(moment(stop), 'minutes'));
    };
    return duration ? duration : calcDuration(value, stopTime);
  }),
  stopTime: null,
  _stopTime: on('init', computed('stopTime','_showDuration', function() {
    return this.get('stopTime') && !this.get('_showDuration');
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
  showDuration: null,
  _showDuration: on('init',computed('showDuration','duration','stopTime', 'value', function() {
    const { showDuration, duration, stopTime } = this.getProperties('showDuration', 'duration', 'stopTime');
    if(showDuration !== null) {
      return showDuration; // UI style has been explicitly stated
    } else {
      // detect usage
      if(duration && stopTime) {
        debug('mini-datetime recieved a duration AND a stopTime; use one or the other not both.');
        return true;
      } else if(duration && !stopTime) {
        return true;
      } else if(stopTime && !duration) {
        const startTime = this.get('value');
        const daysApart = Math.abs(moment(startTime).diff(stopTime,'days',true));
        return daysApart > 1 ? true : false;
      }

      return false;
    }
  })),
  _showStopTime: computed('_showDuration','stopTime', function() {
    const { _showDuration, stopTime } = this.getProperties('_showDuration', 'stopTime');
    return stopTime && !_showDuration;
  }),
  // STYLE ATTRIBUTES
  font: 'inherit',
  _styleFontFamily: computed('font', function() {
    const font = this.get('font');
    return font ? `font-family: ${font}` : '';
  }),
  maxWidth: null,
  _styleMaxWidth: computed('maxWidth', function() {
    const maxWidth = this.get('maxWidth');
    return maxWidth ? `max-width: ${maxWidth}` : '';
  }),
  // STYLER
  _style: computed(...styleProperties,function() {
    const styles = this.getProperties(...styleProperties);
    const styleString = htmlSafe(keys(styles).map((key) => {
      return styles[key];
    }).join('; '));

    return styles ? styleString : null;
  }),
  // ACTIONS
  actions: {
    changeDate: function() {
      const actionSupport = this.get('actionSupport');
      if(actionSupport) {
        console.log('change date');
        this.set('changingTime', false);
        this.toggleProperty('changingDate');
      }
    },
    changeTime: function() {
      const actionSupport = this.get('actionSupport');
      if(actionSupport) {
        console.log('change time');
        this.set('changingDate', false);
        this.toggleProperty('changingTime');
      }
    }
  }
});
