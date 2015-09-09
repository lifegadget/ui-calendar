import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

import layout from '../templates/components/mini-date-change';
import moment from 'moment';

export default Ember.Component.extend({
  layout: layout,
  classNames: ['ui-calendar', 'mini-date-change', 'noselect', 'floater'],
  classNameBindings: ['_inSync:in-sync'],

  datetime: computed.alias('value'),
  value: null,
  _initialValue: on('init', observer(function() {
    this.set('initValue', this.get('_value').clone());
  })),
  _value: computed('value', {
    set(_,value) {
      if(typeOf(value) !== 'class') {
        debug('value was set to a scalar value and it should be set to a moment object');
      }
      return value;
    },
    get() {
      const value = this.get('value');
      return value ? moment(value) : moment();
    }
  }),
  numDateChoices: 4,

  // is component's internal value equal to the containers value
  _inSync: computed('value', '_value', function() {
    let {value,_value} = this.getProperties('value','_value');
    if(typeOf(value) === 'string') {
      value = moment(value);
    }

    return value.format('YYYY-MM-DD HH:MM:SS') === _value.format('YYYY-MM-DD HH:MM:SS');
  }),
  _dateRangeOffset: 0,
  _dateRange: computed('value','_dateRangeOffset', 'numDateChoices', function() {
    const {_value,numDateChoices, _dateRangeOffset} = this.getProperties('_value','numDateChoices', '_dateRangeOffset');
    const offsetDays = _dateRangeOffset * numDateChoices;
    let dates = new A([]);
    for(var i=0; i < numDateChoices; i++) {
      dates.pushObject(_value.clone().add(offsetDays + i, 'days'));
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
      if (action === 'values') {
        let [yyyy,mm,dd] = value[0].split('-');
        let newValue = this.get('_value').clone().year(yyyy).month(mm).date(dd);
        // console.log('new value [%s,%s,%s]: %s', yyyy,mm,dd, newValue.format('YYYY-MM-DD'));
        this.set('_value', newValue);
        this.sendAction('onDateChange', newValue.format('YYYY'), newValue.format('MM'), newValue.format('DD'));
      }
    }
  }

});
