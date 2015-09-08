import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

import layout from '../templates/components/mini-date-change';
import moment from 'moment';

export default Ember.Component.extend({
  layout: layout,
  classNames: ['ui-calendar', 'mini-date-change','flexy','space-between','middle', 'noselect', 'floater'],

  datetime: computed.alias('value'),
  value: null,
  _value: computed('value', function() {
    const value = this.get('value');
    return value ? moment(value) : moment();
  }),
  numDateChoices: 4,

  _dateRangeOffset: 0,
  _dateRange: computed('value','_dateRangeOffset', 'numDateChoices', function() {
    const {_value,numDateChoices, _dateRangeOffset} = this.getProperties('_value','numDateChoices', '_dateRangeOffset');
    const offsetDays = _dateRangeOffset * numDateChoices;
    let dates = new A([]);
    for(var i=0; i < numDateChoices; i++) {
      dates.pushObject(_value.clone().add(offsetDays + i, 'days'));
    }
    console.log('date range[%s days]: %o', numDateChoices, dates);

    return dates;
  }),
  actions: {

    increaseDateRange() {
      this.set('_dateRangeOffset', this.get('_dateRangeOffset') + 1);
    },
    decreaseDateRange() {
      this.set('_dateRangeOffset', this.get('_dateRangeOffset') - 1);
    },
    changed(newValue) {
      // this.sendAction('changed', ...newValue.split('-'));
    }

  }

});
