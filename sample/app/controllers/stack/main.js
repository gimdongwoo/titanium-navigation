'use strict';

var CONFIG = arguments[0] || {};

function navigateProfile() {
  var navigate = CONFIG.navigation.navigate;

  navigate('Profile');
}

exports.navigationOptions = {
  window: {
    title: 'Main'
  },
  navBar: {
    title: 'Main'
  }
};
