'use strict';

var a = 'test';

function doClick(e) {
  alert($.label.text + a);
}

$.index.open();

var _Alloy$createWidget = Alloy.createWidget('titanium.navigation'),
    StackNavigator = _Alloy$createWidget.StackNavigator;

var BasicApp = StackNavigator({
  Main: { screen: 'main' },
  Profile: { screen: 'profile' }
});
