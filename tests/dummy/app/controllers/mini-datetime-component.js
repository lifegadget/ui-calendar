import Ember from 'ember';

export default Ember.Controller.extend({

  containerWidths: [
    { id: 200, name: '200px' },
    { id: 250, name: '250px' },
    { id: 300, name: '300px' },
    { id: 350, name: '350px' },
    { id: 400, name: '400px' }
  ],
  exampleContainerWidth: '250'

});
