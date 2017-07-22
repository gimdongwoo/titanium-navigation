$.index.open();

function openStackNavigator() {
  const { StackNavigator } = Alloy.createWidget('titanium.navigation');
  const StackWindow = StackNavigator({
    Main: { controller: 'stack/main' },
    Profile: { controller: 'stack/profile' },
  }, {
    initialRouteName: 'Main',
    initialRouteParams: { isCanClose: true }
  });
  StackWindow.open();
}

function openTabNavigator() {
  const { TabNavigator } = Alloy.createWidget('titanium.navigation');
  const TabWindow = TabNavigator({
    Tab1: { controller: 'tab/tab1' },
    Tab2: { controller: 'tab/tab2' },
    Tab3: { controller: 'tab/tab3' },
  }, {
    initialRouteName: 'Tab1',
    initialRouteParams: { isCanClose: true }
  });
  TabWindow.open();
}

function onClickTbl({ rowData }) {
  switch (rowData.title) {
    case 'StackNavigator': {
      return openStackNavigator();
    }
    case 'TabNavigator': {
      return openTabNavigator();
    }
    default: {
      return false;
    }
  }
}
