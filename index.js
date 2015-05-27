/* jshint node: true */
'use strict';

module.exports = {
  name: 'ui-calendar',
  description: 'Calendar components for ambitious applications',
  included: function(app) {
    this._super.included(app);
    app.import('vendor/ui-calendar/ui-calendar.css');
  }
};

