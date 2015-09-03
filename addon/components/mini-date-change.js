import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

import layout from '../templates/components/mini-date-change';
import moment from 'moment';

export default Ember.Component.extend({
  layout: layout,
  classNames: ['mini-change','date','flexy','space-between','middle', 'noselect'],

  // START/STOP VALUES
  value: null,
  _value: computed('value', function() {
    const value = this.get('value');
    return value ? moment(value) : moment();
  }),
  stopTime: null,
  _stopTime: computed('stopTime', function() {
    const stopTime = this.get('stopTime');
    return stopTime ? moment(stopTime) : null;
  }),

  dateRangeOffset: 0,
  numDateChoices: 4,
  _dateRange: computed('value','stopTime','dateRangeOffset', 'numDateChoices', function() {
    const currentStart = this.get('_value');
    // const currentStop = this.get('_stopTime');
    const {numDateChoices, dateRangeOffset} = this.getProperties('numDateChoices', 'dateRangeOffset');
    const offsetDays = dateRangeOffset * numDateChoices;
    let dates = new A([]);
    for(var i=0; i < numDateChoices; i++) {
      dates.pushObject(currentStart.clone().add(offsetDays + i, 'days'));
    }

    return dates;
  }),
  actions: {
    increaseDateRange: function() {
      this.set('dateRangeOffset', this.get('dateRangeOffset') + 1);
    },
    decreaseDateRange: function() {
      this.set('dateRangeOffset', this.get('dateRangeOffset') - 1);
    },
    changed: function(newValue) {
      this.sendAction('changed', ...newValue.split('-'));
    }

  }

});
