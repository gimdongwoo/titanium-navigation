const STATE = {};
const SCREEN = {};

function init({ routes, config }) {
  STATE.routes = routes;
  STATE.config = config;
  console.log('StackNavigator init', STATE);
}

function addNavbar(window, options) {
}

function createWindow(name) {
  const route = STATE.routes[name];
  const options = route.options || {};

  SCREEN[name] = {};
  const screen = SCREEN[name];

  screen.controller = Alloy.createController(route.controller, options);

  const firstView = screen.controller.getView();
  if (typeof firstView.open === 'function') {
    // window
    screen.window = firstView;
  } else {
    // view
    screen.window = Ti.UI.createWindow({ navBarHidden: options.navBarHidden });
    if (!options.navBarHidden) addNavbar(screen.window, options);
    screen.window.add(firstView);
    screen.view = firstView;
  }

  // closed event
  screen.window.addEventListener('close', function () {
    screen.controller.destroy();
  });

  return screen;
}

function closeWindow(name) {
  const screen = SCREEN[name];
  if (typeof screen !== 'object') return;

  if (screen.view) screen.view.fireEvent('close'); // close event for $.getView.addEventListener(...);
  if (screen.window) screen.window.close();

  // null out
  SCREEN[name] = null;
}

function openWindow(name) {
  // closed before opened
  closeWindow(name);

  // open
  const screen = createWindow(name);
  screen.window.open();
  if (screen.view) screen.view.fireEvent('open'); // open event for $.getView.addEventListener(...);
}

// exports
exports.open = () => {
  console.log('StackNavigator open');
  const { initialRouteName } = STATE.config;
  openWindow(initialRouteName || Object.keys(STATE.routes)[0]);
};
exports.navigate = (name) => {
  console.log('navigate :', name);
  if (!name) return;
  openWindow(name);
};

init(arguments[0]);
