const STATE = {};

function init(args) {
  STATE.args = args || {};
  console.log('widget init', STATE);
}

function StackNavigator(routes, config) {
  const stackNavigator = Widget.createController('stack', { routes, config });
  return stackNavigator;
}

exports.StackNavigator = StackNavigator;

init(arguments[0]);
