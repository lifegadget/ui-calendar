import Ember from 'ember';
import ddau from 'ui-calendar/mixins/ddau';

const { keys, create } = Object; // jshint ignore:line
const { RSVP: {Promise} } = Ember; // jshint ignore:line
const { inject: {service} } = Ember; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

import layout from '../templates/components/mini-date-change';
import moment from 'moment';

const dateChange = Ember.Component.extend(ddau, {
  layout: layout,

  classNames: ['ui-calendar', 'mini-date-change', 'noselect', 'floater'],
  classNameBindings: ['_hasChanged:has-changed'],

  init() {
    this._super(...arguments);
    const {_value, _defaultValue, defaultValue} = this.getProperties('_value', '_defaultValue', 'defaultValue');
    // set default value
    run.later(() => {
      if(!_value) {
        this.ddau('onChange', {
          code: 'suggested-default',
          oldValue: undefined,
          newValue: _defaultValue,
          defaultValue: defaultValue,
          context: this
        }, _defaultValue);
      }
      // set initial value
      this.set('initialValue', _value);
      run.schedule('afterRender', () => {
        this._calcAutoChoiceNumber();
        this.onResize = run.bind(this, 'resize');
        $(window).on('resize', this.onResize);
      });
    }, 0);
  },
  onResize() {
    this._calcAutoChoiceNumber();
  },
  _calcAutoChoiceNumber() {
    const widgetWidth = $(`#${this.get('elementId')}`).innerWidth();
    this.set('_autoChoiceNumber', Math.floor(widgetWidth / 60));
  },

  defaultValue: null,
  _defaultValue: computed('defaultValue', function() {
    const defaultValue = this.get('defaultValue') || 'today';
    const namedDays = {
      today: 0,
      tomorrow: 1,
      yesterday: -1
    };
    return a(keys(namedDays)).contains(defaultValue) ? moment().add(namedDays[defaultValue], 'days').format('YYYY-MM-DD') : moment(defaultValue).format('YYYY-MM-DD');
  }),

  date: computed.alias('value'),
  // normalizes internal date representation as
  // a string of "YYYY-MM-DD"
  value: null,
  _value: computed('value', function() {
    const value = this.get('value');
    return value ? moment(value).format('YYYY-MM-DD') : undefined;
  }),

  today: computed(function() {
    return moment().format('YYYY-MM-DD');
  }),
  // is component's internal value equal to the containers value
  _hasChanged: computed('initialValue', '_value', function() {
    return this.get('initialValue') === this.get('_value');
  }),
  // DATE RANGES
  _numDateChoices: computed('numDateChoices', '_autoChoiceNumber', function() {
    let {numDateChoices, _autoChoiceNumber} = this.getProperties('numDateChoices', '_autoChoiceNumber');
    if (!numDateChoices) { numDateChoices = 'auto'; }
    return numDateChoices === 'auto' ?  _autoChoiceNumber : numDateChoices;
  }),
  rangeToValuePosition: 'start', // [start, middle, end]
  _dateRangeOffset: 0,
  _dateRangeOrigin: computed('rangeToValuePosition', 'defaultValue', 'value', function() {
    const {rangeToValuePosition, initialValue, _numDateChoices} = this.getProperties('rangeToValuePosition', 'initialValue', '_numDateChoices');
    switch(rangeToValuePosition) {
      case 'start':
        return initialValue;
      case 'end':
        return moment(initialValue).subtract(_numDateChoices).format('YYYY-MM-DD');
      case 'middle':
        return moment(initialValue).subtract(Math.round(_numDateChoices/2)).format('YYYY-MM-DD');
    }
  }),
  dateRange: computed('_dateRangeOffset', '_numDateChoices', '_dateRangeOrigin', 'value', function() {
    const {_numDateChoices, _dateRangeOffset, initialValue} = this.getProperties('_numDateChoices', '_dateRangeOffset', 'initialValue');
    const dates = a();
    const startDate = moment(initialValue).add(_dateRangeOffset * _numDateChoices, 'days');
    for(var i=0; i < _numDateChoices; i++) {
      dates.pushObject(startDate.format('YYYY-MM-DD'));
      startDate.add(1, 'day');
    }

    return dates;
  }),
  actions: {
    increaseDateRange() {
      this.set('_dateRangeOffset', this.get('_dateRangeOffset') + 1);
    },
    decreaseDateRange() {
      this.set('_dateRangeOffset', this.get('_dateRangeOffset') - 1);
    },
    dateChosen(hash) {
      const newValue = hash.value;
      const oldValue = hash.oldValues ? hash.oldValues[0] : undefined;

        this.ddau('onChange', {
          code: 'date-changed',
          oldValue,
          newValue
        }, newValue);

    }
  }

});

dateChange[Ember.NAME_KEY] = 'ui-date-change';
export default dateChange;
