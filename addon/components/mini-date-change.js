import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { RSVP: {Promise} } = Ember; // jshint ignore:line
const { inject: {service} } = Ember; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

import layout from '../templates/components/mini-date-change';
import moment from 'moment';

const dateChange = Ember.Component.extend({
  layout: layout,

  classNames: ['ui-calendar', 'mini-date-change', 'noselect', 'floater'],
  classNameBindings: ['_hasChanged:has-changed'],

  init() {
    this._super(...arguments);
    this.set('initialValue', this.get('_value'));
    run.schedule('afterRender', () => {
      this._calcAutoChoiceNumber();
      this.onResize = run.bind(this, 'resize');
      $(window).on('resize', this.onResize);
    });
  },
  onResize() {
    this._calcAutoChoiceNumber();
  },
  _calcAutoChoiceNumber() {
    const widgetWidth = $(`#${this.get('elementId')}`).innerWidth();

    this.set('_autoChoiceNumber', Math.floor(widgetWidth / 60));
  },

  date: computed.alias('value'),
  // ensures the internal represenation is a string and provides
  // one-way decoupling with container
  value: null,
  _value: computed('value', {
    set(_, value) {
      console.log('set value: ', value);
      return value;
    },
    get() {
      return this.get('value');
    }
    //   const {value} = this.getProperties('value');
    //   if (!value) {
    //     let defaultValue = this._defaultValue();
    //     this.attrs.onChange(defaultValue, null);
    //     return defaultValue;
    //   } else {
    //     return typeOf(value) === 'object' ? value.format('YYYY-MM-DD') : value;
    //   }
    // }
  }),
  // _defaultValue() {
  //   const {defaultValue} = this.getProperties('defaultValue');
  //   let value;
  //   if (defaultValue) {
  //     if(typeOf(defaultValue) === 'object') {
  //       value = defaultValue.format('YYYY-MM-DD');
  //     } else if (defaultValue.indexOf('-') !== -1) {
  //       value = defaultValue;
  //     } else if (defaultValue === 'yesterday') {
  //       value = moment().subtract(1,'day').format('YYYY-MM-DD');
  //     } else if (defaultValue === 'today') {
  //       value = moment().format('YYYY-MM-DD');
  //     } else if (defaultValue === 'tomorrow') {
  //       value = moment().add(1,'day').format('YYYY-MM-DD');
  //     } else {
  //       console.warn(`The date format sent to mini-date-change's "defaultValue" was invalid: `, defaultValue);
  //       value = moment().startOf('day').format('YYYY-MM-DD');
  //     }
  //   } else {
  //     value = moment().format('YYYY-MM-DD').startOf('day');
  //   }
  //   return value;
  // },
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
  _dateRangeOrigin: computed('rangeToValuePosition', '_defaultValue', function() {
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
  dateRange: computed('_dateRangeOffset', '_numDateChoices', '_dateRangeOrigin', function() {
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
    dateChosen(action,value) {
      value = value[0];
      console.log(action, value);
      // INITIAL VALUE

      if (action === 'values' && value !== this.get('_value')) {
        const oldValue = this.get('value');
        const responseType = typeOf(this.get('value'));
        const response = [
          responseType === 'object' ? moment(value).startOf('day') : value, // new value
          responseType === 'object' ? moment(oldValue).startOf('day') : oldValue // old value
        ];

        this.attrs.onChange(...response);
      }
    }
  }

});

dateChange[Ember.NAME_KEY] = 'ui-date-change';
export default dateChange;
