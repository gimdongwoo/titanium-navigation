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
  window: {
    title: 'Tab3'
  },
  navBar: {
    title: 'Tab3'
  },
  tab: {
    title: 'Tab3',
    icon: '/images/tap_nav_more_selected.png',
  }
};
