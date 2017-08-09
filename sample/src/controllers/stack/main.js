const CONFIG = arguments[0] || {};

function navigateProfile() {
  const { navigate } = CONFIG.navigation;
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
