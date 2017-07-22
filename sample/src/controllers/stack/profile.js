const CONFIG = arguments[0] || {};

function navigateBack() {
  const { goBack } = CONFIG.navigation;
  goBack();
}

exports.navigationOptions = {
  title: 'Profile'
};
