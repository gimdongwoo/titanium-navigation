const CONFIG = arguments[0] || {};

$.init = function (args) {
  console.log('widget init');
};

$.StackNavigator = function (args) {
  console.log('StackNavigator', args);
};

$.init(CONFIG);
