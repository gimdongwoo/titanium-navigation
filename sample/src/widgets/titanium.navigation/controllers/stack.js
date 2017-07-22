const STATE = {};
const SCREEN = [];
let topWindow;

const navigationProps = {
  navigation: {
    navigate(name) {
      return openWindow(name);
    },
    goBack() {
      return closeWindow();
    }
  }
};

function init({ routes, config }) {
  STATE.routes = routes || {};
  STATE.config = config || {};
  console.log('StackNavigator init', STATE);
}

function addNavbar(screen, route) {
  const { title = '', isCloseable, onClickBack } = screen.navigationOptions;
  let navBar;

  if (OS_IOS) {
    if (isCloseable) {
      const leftNavButton = $.UI.create('Button', {
        title: 'Back'
      });
      leftNavButton.addEventListener('click', onClickBack || closeWindow);

      screen.window.setLeftNavButton(leftNavButton);
    }
  }
  if (OS_ANDROID) {
    const displayHomeAsUp = (SCREEN.length > 1 || isCloseable) ? true : false;
    navBar = $.UI.create('ActionBar', {
      title,
      onHomeIconItemSelected: onClickBack || closeWindow,
      displayHomeAsUp,
      homeButtonEnabled: (onClickBack || displayHomeAsUp) ? true : false
    });
    screen.window.add(navBar);
  }

  return navBar;
}

function createWindow(name) {
  const route = STATE.routes[name];

  SCREEN.push({});
  const idx = SCREEN.length - 1;
  const screen = SCREEN[idx];

  const controllerOptions = {};
  _.extend(controllerOptions, route.options, navigationProps);
  screen.controller = Alloy.createController(route.controller, controllerOptions);

  screen.navigationOptions = {};
  _.extend(screen.navigationOptions, route.navigationOptions, screen.controller.navigationOptions);

  const firstView = screen.controller.getView();
  if (typeof firstView.open === 'function') {
    // window
    screen.window = firstView;
  } else {
    // view
    screen.window = $.UI.create('Window', {});
    screen.window.add(firstView);
    screen.view = firstView;
  }

  // set window properties
  screen.window.setTitle(screen.navigationOptions.title || '');

  // navBar
  const { navBarHidden = false } = screen.navigationOptions;
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
  const idx = SCREEN.length - 1;
  const screen = SCREEN[idx];
  if (typeof screen !== 'object') return;

  if (OS_IOS && idx === 0 && topWindow) {
    topWindow.close();
    topWindow = null;
    return;
  }

  if (screen.window) screen.window.close();
}

function openWindow(name) {
  // open
  const screen = createWindow(name);

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
exports.open = () => {
  console.log('StackNavigator open');
  const { initialRouteName = Object.keys(STATE.routes)[0], initialRouteParams } = STATE.config;

  const route = STATE.routes[initialRouteName];

  const navigationOptions = {};
  _.extend(navigationOptions, route.navigationOptions, initialRouteParams);
  route.navigationOptions = navigationOptions;

  openWindow(initialRouteName || Object.keys(STATE.routes)[0]);
};

exports.navigate = (name) => {
  console.log('navigate :', name);
  if (!name) return;
  openWindow(name);
};

init(arguments[0]);
