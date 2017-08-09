'use strict';

var STATE = {};
var TAB = {};
var tabGroup = void 0;

var navigationProps = {
  navigation: {
    navigate: function navigate(name) {
      return setActiveTabByName(name);
    },
    goBack: function goBack() {
      return setActiveTabByName(STATE.prevTabName || STATE.nowTabName);
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
      _screen$navigationOpt2 = _screen$navigationOpt.navBar,
      navBar = _screen$navigationOpt2 === undefined ? {} : _screen$navigationOpt2,
      _screen$navigationOpt3 = _screen$navigationOpt.window,
      window = _screen$navigationOpt3 === undefined ? {} : _screen$navigationOpt3,
      isCloseable = _screen$navigationOpt.isCloseable;

  var _navBar = void 0;

  if (OS_IOS) {
    if (isCloseable) {
      var leftNavButton = $.UI.create('Button', {
        title: 'Back'
      });
      leftNavButton.addEventListener('click', closeWindow);

      screen.window.setLeftNavButton(leftNavButton);
    }
  }
  if (OS_ANDROID) {
    _navBar = $.UI.create('ActionBar', _.extend(navBar, {
      title: navBar.title || window.title || '',
      onHomeIconItemSelected: closeWindow,
      displayHomeAsUp: true,
      homeButtonEnabled: isCloseable ? true : false
    }));
    screen.window.add(navBar);
  }

  return _navBar;
}

function createWindow(name) {
  var route = STATE.routes[name];

  var screen = {};

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
    screen.controller.destroy();
  });

  return screen;
}

function closeWindow() {
  // fire close event to tabs

  tabGroup.close();
}

function setActiveTabByName(name) {
  var tab = TAB[name];
  if (!tab) return;

  STATE.prevTabName = STATE.nowTabName;
  STATE.nowTabName = name;

  tabGroup.setActiveTab(tab.tab);

  if (tab.view) tab.view.fireEvent('open'); // open event for $.getView.addEventListener(...);

  if (STATE.prevTabName) {
    var prevTab = TAB[STATE.prevTabName];
    if (prevTab.view) prevTab.view.fireEvent('close'); // close event for $.getView.addEventListener(...);
  }
}

function creatTabs() {
  var tabs = Object.keys(STATE.routes).map(function (name) {
    var screen = createWindow(name);
    var _screen$navigationOpt8 = screen.navigationOptions,
        _screen$navigationOpt9 = _screen$navigationOpt8.window,
        window = _screen$navigationOpt9 === undefined ? {} : _screen$navigationOpt9,
        _screen$navigationOpt10 = _screen$navigationOpt8.tab,
        tab = _screen$navigationOpt10 === undefined ? {} : _screen$navigationOpt10;

    screen.tab = $.UI.create('Tab', _.extend(tab, {
      window: screen.window,
      title: tab.title || window.title || '',
      icon: tab.icon || null
    }));
    TAB[name] = screen;

    return screen.tab;
  });

  return tabs;
}

function openTabGroup() {
  if (!tabGroup) {
    var tabs = creatTabs();
    tabGroup = $.UI.create('TabGroup', { tabs: tabs });
  }

  tabGroup.open();
}

// exports
exports.open = function () {
  console.log('TabNavigator open');
  var _STATE$config = STATE.config,
      _STATE$config$initial = _STATE$config.initialRouteName,
      initialRouteName = _STATE$config$initial === undefined ? Object.keys(STATE.routes)[0] : _STATE$config$initial,
      initialRouteParams = _STATE$config.initialRouteParams;


  var route = STATE.routes[initialRouteName];

  var navigationOptions = {};
  _.extend(navigationOptions, route.navigationOptions, initialRouteParams);
  route.navigationOptions = navigationOptions;

  openTabGroup();

  setActiveTabByName(initialRouteName || Object.keys(STATE.routes)[0]);
};

exports.navigate = function (name) {
  console.log('navigate :', name);
  if (!name) return;
  setActiveTabByName(name);
};

init(arguments[0]);
