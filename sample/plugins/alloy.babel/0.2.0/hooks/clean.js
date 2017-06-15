const path = require('path');
const fs = require('fs-extra');
const BasePlugin = require('./plugin');

class CleanPlugin extends BasePlugin {
  constructor() {
    super();
    this.handlePostClean = this.handlePostClean.bind(this);
  }

  addHooks() {
    this.cli.on('clean.post', this.handlePostClean);
  }

  handlePostClean(data, next) {
    const appPath = path.join(this.cli.argv['project-dir'], 'app');
    this.log(`Cleaning artifacts ${appPath}`);
    fs.remove(appPath)
      .then(() => next())
      .catch(e => next(e));
  }
}

module.exports = new CleanPlugin();