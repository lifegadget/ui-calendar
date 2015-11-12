import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

export default Ember.Controller.extend({
  queryParams: ['containerSize','fontSize','fontFamily','actionSupport'],

  containerSize:false,
  fontSize: 'default',
  fontFamily: 'inherit',
  ampm: true,
  disabled: false,
  actionSupport: true
});
