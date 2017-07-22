'use strict';

$.index.open();

function openStackNavigator() {
  var _Alloy$createWidget = Alloy.createWidget('titanium.navigation'),
      StackNavigator = _Alloy$createWidget.StackNavigator;

  var StackWindow = StackNavigator({
    Main: { controller: 'stack/main' },
    Profile: { controller: 'stack/profile' }
  }, {
    initialRouteName: 'Main',
    initialRouteParams: { isCanClose: true }
  });
  StackWindow.open();
}

function openTabNavigator() {
  var _Alloy$createWidget2 = Alloy.createWidget('titanium.navigation'),
      TabNavigator = _Alloy$createWidget2.TabNavigator;

  var TabWindow = TabNavigator({
    Tab1: { controller: 'tab/tab1' },
    Tab2: { controller: 'tab/tab2' },
    Tab3: { controller: 'tab/tab3' }
  }, {
    initialRouteName: 'Tab1',
    initialRouteParams: { isCanClose: true }
  });
  TabWindow.open();
}

function onClickTbl(_ref) {
  var rowData = _ref.rowData;

  switch (rowData.title) {
    case 'StackNavigator':
      {
        return openStackNavigator();
      }
    case 'TabNavigator':
      {
        return openTabNavigator();
      }
    default:
      {
        return false;
      }
  }
}
