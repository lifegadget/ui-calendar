import Ember from 'ember';
const { computed, observer, $, A, run, on, typeOf, debug, keys, get, set, inject } = Ember;    // jshint ignore:line

import layout from '../templates/components/mini-time-change';

export default Ember.Component.extend({
  layout: layout,
  classNames: ['ui-calendar','mini-change','time'],

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

  minutesBlock: 0,
  minutesPerBlock: 15,
  numberOfBlocks: computed('minutesPerBlock', function() {
    const minutesPerBlock = this.get('minutesPerBlock');
    return (60 * 24) / minutesPerBlock - 1;
  }),
  minutesObserver: observer('minutesBlock', function() {
    const value = this.get('_value');
    const currentMinutes = Number(value.format('H') * 60 + value.format('mm'));
    const minutesPerBlock = this.get('minutesPerBlock');
    const currentMinutesBlock = Math.floor(currentMinutes / minutesPerBlock);
    const minutesBlock = this.get('minutesBlock');
    // if(currentMinutesBlock !== minutesBlock) {
    //   value.startOf('day')
    // }
  }),
  valueObserver: on('init',observer('value', function() {
    const value = this.get('_value');
    const currentMinutes = Number(value.format('h') * 60 + value.format('mm'));
    const minutesPerBlock = this.get('minutesPerBlock');
    const currentMinutesBlock = Math.floor(currentMinutes / minutesPerBlock);
    const minutesBlock = this.get('minutesBlock');
    if(currentMinutesBlock !== minutesBlock) {
      console.log('current min block[%s:%s => %s]: %o', value.format('h'),value.format('mm'), currentMinutes, currentMinutesBlock);
      this.set('minutesBlock', currentMinutesBlock);
    }
  }))

});
