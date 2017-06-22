let CONFIG = {};
const STATE = {};

$.init = (args) => {
  CONFIG = args || {};
  console.log('StackNavigator init', CONFIG);
};

function addNavbar(window, options) {
}

function createWindow(name) {
  STATE[name] = {};
  const screen = STATE[name];
  const options = CONFIG[name].options || {};

  screen.controller = Alloy.createController(CONFIG[name].controller, options);

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
  const screen = STATE[name];
  if (typeof screen !== 'object') return;

  if (screen.view) screen.view.fireEvent('close'); // close event for $.getView.addEventListener(...);
  if (screen.window) screen.window.close();

  // null out
  STATE[name] = null;
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
exports.openMain = () => {
  console.log('StackNavigator openMain');
  openWindow('Main');
};
exports.navigate = (name) => {
  console.log('navigate :', name);
  if (!name) return;
  openWindow(name);
};

$.init(arguments[0]);
