const a = 'test';

function doClick(e) {
  alert($.label.text + a);
}

$.index.open();

const { StackNavigator } = Alloy.createWidget('titanium.navigation');
const BasicApp = StackNavigator({
  Main: { screen: 'main' },
  Profile: { screen: 'profile' },
});
