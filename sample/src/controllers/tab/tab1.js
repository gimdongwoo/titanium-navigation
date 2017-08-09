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
    title: 'Tab1'
  },
  navBar: {
    title: 'Tab1'
  },
  tab: {
    title: 'Tab1',
    icon: '/images/tap_nav_newsfeed_selected.png',
  }
};
