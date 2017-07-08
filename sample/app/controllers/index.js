'use strict';

// $.index.open();

var _Alloy$createWidget = Alloy.createWidget('titanium.navigation'),
    StackNavigator = _Alloy$createWidget.StackNavigator;

var BasicApp = StackNavigator({
  Main: { controller: 'basic/main' },
  Profile: { controller: 'basic/profile' }
}, {
  initialRouteName: 'Main'
});
BasicApp.open();
