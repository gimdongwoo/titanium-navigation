'use strict';

var CONFIG = arguments[0] || {};

function navigateBack() {
  var goBack = CONFIG.navigation.goBack;

  goBack();
}

exports.navigationOptions = {
  window: {
    title: 'Profile'
  },
  navBar: {
    title: 'Profile'
  }
};
