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
    title: 'Tab3'
  },
  navBar: {
    title: 'Tab3'
  },
  tab: {
    title: 'Tab3',
    icon: '/images/tap_nav_more_selected.png'
  }
};
