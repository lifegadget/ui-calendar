import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('mini-datetime-component');
  this.route('demo-mini-time-change');
  this.route('demo-mini-date-change');
  this.route('demo-date-picker');
});

export default Router;
