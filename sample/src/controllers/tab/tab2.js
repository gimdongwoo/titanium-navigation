const CONFIG = arguments[0] || {};

function navigateTab1() {
  const { navigate } = CONFIG.navigation;
  navigate('Tab1');
}

function navigateTab2() {
  const { navigate } = CONFIG.navigation;
  navigate('Tab2');
}

function navigateTab3() {
  const { navigate } = CONFIG.navigation;
  navigate('Tab3');
}

exports.navigationOptions = {
  title: 'Tab2',
  tabBarLabel: 'tab2',
};
