let CONFIG;

$.init = (args) => {
  CONFIG = args || {};
  console.log('widget init', CONFIG);
};

$.StackNavigator = (args) => {
  const stackNavigator = Widget.createController('stack', args);
  stackNavigator.openMain();

  return stackNavigator;
};

$.init(arguments[0]);
