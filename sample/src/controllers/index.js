$.index.open();

function openStackNavigator() {
  const { StackNavigator } = Alloy.createWidget('titanium.navigation');
  const BasicApp = StackNavigator({
    Main: { controller: 'basic/main' },
    Profile: { controller: 'basic/profile' },
  }, {
    initialRouteName: 'Main',
    initialRouteParams: { isCanClose: true }
  });
  BasicApp.open();
}

function onClickTbl({ rowData }) {
  switch (rowData.title) {
    case 'StackNavigator': {
      return openStackNavigator();
    }
    default: {
      return false;
    }
  }
}
