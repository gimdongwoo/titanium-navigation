'use strict';

var CONFIG = arguments[0] || {};

function navigateTab1() {
  var navigate = CONFIG.navigation.navigate;

  navigate('Tab1');
}

function navigateTab2() {
  var navigate = CONFIG.navigation.navigate;

  navigate('Tab2');
}

function navigateTab3() {
  var navigate = CONFIG.navigation.navigate;

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
    icon: '/images/tap_nav_newsfeed_selected.png'
  }
};
