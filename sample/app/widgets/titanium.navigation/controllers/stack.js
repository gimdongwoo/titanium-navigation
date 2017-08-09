'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var STATE = {};
var SCREEN = [];
var topWindow = void 0;

var navigationProps = {
  navigation: {
    navigate: function navigate(name) {
      return openWindow(name);
    },
    goBack: function goBack() {
      return closeWindow();
    }
  }
};

function init(_ref) {
  var routes = _ref.routes,
      config = _ref.config;

  STATE.routes = routes || {};
  STATE.config = config || {};
  console.log('StackNavigator init', STATE);
}

function addNavbar(screen, route) {
  var _screen$navigationOpt = screen.navigationOptions,
      _screen$navigationOpt2 = _screen$navigationOpt.window,
      window = _screen$navigationOpt2 === undefined ? {} : _screen$navigationOpt2,
      _screen$navigationOpt3 = _screen$navigationOpt.navBar,
      navBar = _screen$navigationOpt3 === undefined ? {} : _screen$navigationOpt3,
      isCloseable = _screen$navigationOpt.isCloseable,
      onClickBack = _screen$navigationOpt.onClickBack;

  var _navBar = void 0;

  if (OS_IOS) {
    if (isCloseable) {
      var leftNavButton = $.UI.create('Button', {
        title: 'Back'
      });
      leftNavButton.addEventListener('click', onClickBack || closeWindow);

      screen.window.setLeftNavButton(leftNavButton);
    }
  }
  if (OS_ANDROID) {
    var displayHomeAsUp = SCREEN.length > 1 || isCloseable ? true : false;
    _navBar = $.UI.create('ActionBar', _.extend(navBar, {
      title: navBar.title || window.title || '',
      onHomeIconItemSelected: onClickBack || closeWindow,
      displayHomeAsUp: displayHomeAsUp,
      homeButtonEnabled: onClickBack || displayHomeAsUp ? true : false
    }));
    screen.window.add(navBar);
  }

  return _navBar;
}

function createWindow(name) {
  var route = STATE.routes[name];

  SCREEN.push({});
  var idx = SCREEN.length - 1;
  var screen = SCREEN[idx];

  var controllerOptions = {};
  _.extend(controllerOptions, route.options, navigationProps);
  screen.controller = Alloy.createController(route.controller, controllerOptions);

  screen.navigationOptions = {};
  _.extend(screen.navigationOptions, route.navigationOptions, screen.controller.navigationOptions);

  var _screen$navigationOpt4 = screen.navigationOptions,
      _screen$navigationOpt5 = _screen$navigationOpt4.window,
      window = _screen$navigationOpt5 === undefined ? {} : _screen$navigationOpt5,
      _screen$navigationOpt6 = _screen$navigationOpt4.navBar,
      navBar = _screen$navigationOpt6 === undefined ? {} : _screen$navigationOpt6;


  var firstView = screen.controller.getView();
  if (typeof firstView.open === 'function') {
    // window
    screen.window = firstView;
  } else {
    // view
    screen.window = $.UI.create('Window', window);
    screen.window.add(firstView);
    screen.view = firstView;
  }

  // set window properties
  screen.window.setTitle(window.title || navBar.title || '');

  // navBar
  var _screen$navigationOpt7 = screen.navigationOptions.navBarHidden,
      navBarHidden = _screen$navigationOpt7 === undefined ? false : _screen$navigationOpt7;

  screen.window.setNavBarHidden(navBarHidden);
  if (!navBarHidden) screen.navbar = addNavbar(screen, route);

  // closed event
  screen.window.addEventListener('close', function closeFn() {
    screen.window.removeEventListener('close', closeFn);
    console.log('window closed :', screen.window.title);

    if (screen.view) screen.view.fireEvent('close'); // close event for $.getView.addEventListener(...);
    SCREEN.pop();
    screen.controller.destroy();
  });

  return screen;
}

function closeWindow() {
  var idx = SCREEN.length - 1;
  var screen = SCREEN[idx];
  if ((typeof screen === 'undefined' ? 'undefined' : _typeof(screen)) !== 'object') return;

  if (OS_IOS && idx === 0 && topWindow) {
    topWindow.close();
    topWindow = null;
    return;
  }

  if (screen.window) screen.window.close();
}

function openWindow(name) {
  // open
  var screen = createWindow(name);

  console.log('window open :', screen.window.title);

  if (OS_IOS) {
    if (!topWindow) topWindow = $.UI.create('NavigationWindow', {});

    if (SCREEN.length === 1) {
      topWindow.window = screen.window;
      topWindow.open();
    } else {
      topWindow.openWindow(screen.window);
    }
  }
  if (OS_ANDROID) {
    screen.window.open();
  }

  if (screen.view) screen.view.fireEvent('open'); // open event for $.getView.addEventListener(...);
}

// exports
exports.open = function () {
  console.log('StackNavigator open');
  var _STATE$config = STATE.config,
      _STATE$config$initial = _STATE$config.initialRouteName,
      initialRouteName = _STATE$config$initial === undefined ? Object.keys(STATE.routes)[0] : _STATE$config$initial,
      initialRouteParams = _STATE$config.initialRouteParams;


  var route = STATE.routes[initialRouteName];

  var navigationOptions = {};
  _.extend(navigationOptions, route.navigationOptions, initialRouteParams);
  route.navigationOptions = navigationOptions;

  openWindow(initialRouteName || Object.keys(STATE.routes)[0]);
};

exports.navigate = function (name) {
  console.log('navigate :', name);
  if (!name) return;
  openWindow(name);
};

init(arguments[0]);
