import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { RSVP: {Promise} } = Ember; // jshint ignore:line
const { inject: {service} } = Ember; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

import moment from 'moment';

export function weekend([date]) {
  const days = a(['Sa', 'Su']);
  if (typeOf(date) !== 'object') {
    date = moment(date);
  }
  return days.contains(date.format('dd'));
}

export default Ember.Helper.helper(weekend);
