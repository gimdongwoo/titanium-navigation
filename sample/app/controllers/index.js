'use strict';

$.index.open();

function openStackNavigator() {
  var _Alloy$createWidget = Alloy.createWidget('titanium.navigation'),
      StackNavigator = _Alloy$createWidget.StackNavigator;

  var BasicApp = StackNavigator({
    Main: { controller: 'basic/main' },
    Profile: { controller: 'basic/profile' }
  }, {
    initialRouteName: 'Main',
    initialRouteParams: { isCanClose: true }
  });
  BasicApp.open();
}

function onClickTbl(_ref) {
  var rowData = _ref.rowData;

  switch (rowData.title) {
    case 'StackNavigator':
      {
        return openStackNavigator();
      }
    default:
      {
        return false;
      }
  }
}
