import Ember from 'ember';
const { computed, observer, $, A, run, on, typeOf, debug, keys, get, set, inject } = Ember;    // jshint ignore:line

export default Ember.Controller.extend({
  queryParams: ['exampleContainerWidth','fontSize','fontFamily','actionSupport'],

  containerWidths: [
    { id: 200, name: '200px' },
    { id: 250, name: '250px' },
    { id: 300, name: '300px' },
    { id: 350, name: '350px' },
    { id: 400, name: '400px' }
  ],
  exampleContainerWidth: '250',
  fontSize: 'normal',
  fontFamily: 'inherit',
  apiType: 'stopTime',
  _apiType: on('init', observer('apiType', function() {
    const apiType = this.get('apiType');
    switch(apiType) {
      case "stopTime":
        this.set('stopTime', '2015-05-04 14:30:00');
        this.set('duration', null);
        break;
      case "stopTime(long)":
        this.set('stopTime', '2015-05-13 16:30:00');
        this.set('duration', null);
        break;
      case "duration":
        this.set('stopTime', null);
        this.set('duration', 60);
        break;
    }
  })),
  apiIsDuration: computed('apiType', function() {
    return this.get('apiType') === 'duration';
  }),
  uiType: 'implicit',
  showDuration: computed('uiType', function() {
    const uiType = this.get('uiType');
    const valueMapper = {
      implicit: null,
      stopTime: false,
      duration: true
    };
    return valueMapper[uiType];
  }),
  uiIsDuration: computed('apiType', function() {
    return this.get('uiType') === 'duration';
  }),
  ampm: true,
  disabled: false

});
