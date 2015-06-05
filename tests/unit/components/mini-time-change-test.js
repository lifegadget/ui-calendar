import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('mini-time-change', 'Unit | Component | mini time change', {
  // Specify the other units that are required for this test
  needs: ['component:ui-icon', 'component:ui-buttons', 'component:ui-radio-button']
});

test('it renders', function(assert) {
  assert.expect(2);

  // Creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
