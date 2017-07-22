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

function TabNavigator(routes, config) {
  const tabNavigator = Widget.createController('tab', { routes, config });
  return tabNavigator;
}
exports.TabNavigator = TabNavigator;

init(arguments[0]);
