# Titanium Navigation

`Titanium Navigation` allows you to define navigation structures for Titanium applications.
It also renders common elements such as navbar(=actionbar) and tab bar.

## Built-in Navigations

It includes the following functions to help you create navigations:

- [StackNavigation](/docs/navigation/StackNavigation.md) - Renders one screen at a time and provides transitions between screens. When a new screen is opened it is placed on top of the stack.
- [TabNavigation](/docs/navigation/TabNavigation.md) - Renders a tab bar that lets the user switch between several screens. It use Titanium `TabGroup` and `Tab`.
- [DrawerNavigation](/docs/navigation/DrawerNavigation.md) - Provides a drawer that slides in from the left or right of the screen.

## Controllers with Navigation

The navigations render views from controllers.
To learn how to create views, read about:

- [navigation](/docs/common/navigation.md) : Controller `arguments[0].navigation` to allow the screen to call navigation actions, such as opening another screen
- [navigationOptions](/docs/common/navigationOptions.md) : Controller's `exports.navigationOptions` to customize how the screen gets presented by the navigation (e.g. navBar title, tab label)

### Calling Navigation on Controller

`Titanium Navigation` provide navigation in Titanium widget, it can use as follows.

```js
var StackNavigator = Alloy.createWidget('titanium.navigation').StackNavigator;

var StackWindow = StackNavigator({
  Main: { controller: 'stack/main' },
  Profile: { controller: 'stack/profile' }
}, {
  initialRouteName: 'Main',
  initialRouteParams: { isCloseable: true }
});

StackWindow.open();
```

Get the top-level view from the controller and display it.

## Get it

Install and add this component to your project using [gitt.io cli](http://gitt.io/cli).

```
$ gittio install titanium.navigation
```

Or take the widget from this repository and add it manually.

## Inspired by these

[React Navigation](https://github.com/react-community/react-navigation) : We try to provide the same function as this. The code is completely different. We also refer to documents from this, but we expect to change gradually.

## Need to contributions

We hope to get your star and report issue, and join the code.