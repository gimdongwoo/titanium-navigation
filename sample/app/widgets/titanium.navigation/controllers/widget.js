'use strict';

var STATE = {};

function init(args) {
  STATE.args = args || {};
  console.log('widget init', STATE);
}

function StackNavigator(routes, config) {
  var stackNavigator = Widget.createController('stack', { routes: routes, config: config });
  return stackNavigator;
}
exports.StackNavigator = StackNavigator;

function TabNavigator(routes, config) {
  var tabNavigator = Widget.createController('tab', { routes: routes, config: config });
  return tabNavigator;
}
exports.TabNavigator = TabNavigator;

init(arguments[0]);
