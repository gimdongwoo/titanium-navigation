const STATE = {};
const TAB = {};
let tabGroup;

const navigationProps = {
  navigation: {
    navigate(name) {
      return setActiveTabByName(name);
    },
    goBack() {
      return setActiveTabByName(STATE.prevTabName || STATE.nowTabName);
    }
  }
};

function init({ routes, config }) {
  STATE.routes = routes || {};
  STATE.config = config || {};
  console.log('StackNavigator init', STATE);
}

function addNavbar(screen, route) {
  const { navBar = {}, window = {}, isCloseable } = screen.navigationOptions;
  let _navBar;

  if (OS_IOS) {
    if (isCloseable) {
      const leftNavButton = $.UI.create('Button', {
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
  const route = STATE.routes[name];

  const screen = {};

  const controllerOptions = {};
  _.extend(controllerOptions, route.options, navigationProps);
  screen.controller = Alloy.createController(route.controller, controllerOptions);

  screen.navigationOptions = {};
  _.extend(screen.navigationOptions, route.navigationOptions, screen.controller.navigationOptions);

  const { window = {}, navBar = {} } = screen.navigationOptions;

  const firstView = screen.controller.getView();
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
  const { navBarHidden = false } = screen.navigationOptions;
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
  const tab = TAB[name];
  if (!tab) return;

  STATE.prevTabName = STATE.nowTabName;
  STATE.nowTabName = name;

  tabGroup.setActiveTab(tab.tab);

  if (tab.view) tab.view.fireEvent('open'); // open event for $.getView.addEventListener(...);

  if (STATE.prevTabName) {
    const prevTab = TAB[STATE.prevTabName];
    if (prevTab.view) prevTab.view.fireEvent('close'); // close event for $.getView.addEventListener(...);
  }
}

function creatTabs() {
  const tabs = Object.keys(STATE.routes).map((name) => {
    const screen = createWindow(name);
    const { window = {}, tab = {} } = screen.navigationOptions;
    screen.tab = $.UI.create('Tab', _.extend(tab, {
      window: screen.window,
      title: tab.title || window.title || '',
      icon: tab.icon || null,
    }));
    TAB[name] = screen;

    return screen.tab;
  });

  return tabs;
}

function openTabGroup() {
  if (!tabGroup) {
    const tabs = creatTabs();
    tabGroup = $.UI.create('TabGroup', { tabs });
  }

  tabGroup.open();
}

// exports
exports.open = () => {
  console.log('TabNavigator open');
  const { initialRouteName = Object.keys(STATE.routes)[0], initialRouteParams } = STATE.config;

  const route = STATE.routes[initialRouteName];

  const navigationOptions = {};
  _.extend(navigationOptions, route.navigationOptions, initialRouteParams);
  route.navigationOptions = navigationOptions;

  openTabGroup();

  setActiveTabByName(initialRouteName || Object.keys(STATE.routes)[0]);
};

exports.navigate = (name) => {
  console.log('navigate :', name);
  if (!name) return;
  setActiveTabByName(name);
};

init(arguments[0]);
