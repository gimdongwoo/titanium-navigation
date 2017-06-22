// $.index.open();

const { StackNavigator } = Alloy.createWidget('titanium.navigation');
const BasicApp = StackNavigator({
  Main: { controller: 'basic/main' },
  Profile: { controller: 'basic/profile' },
});
