const install = root => {
  const path = require('path');
  const fs = require('fs-extra');

  const pluginsDir = path.join(root, 'plugins');

  console.log(`Trying to add plugin to ${pluginsDir}`);
  if (fs.pathExistsSync(pluginsDir)) {
    const packageInfo = require('../package.json');
    const dstDir = path.join(pluginsDir, packageInfo.name, packageInfo.version);

    fs.ensureDirSync(dstDir);

    console.log(`Cleaning dir for plugin ${pluginsDir}`);
    // fs.emptyDirSync(dstDir);

    const srcDir = path.join(__dirname, '..');
    console.log(`Copying plugin code ${srcDir} -> ${dstDir}`);
    fs.copySync(srcDir, dstDir);
  } else {
    console.warn(`Couldn't locate /plugins dir at ${pluginsDir}`);
  }
};

if (require.main === module) {
  if (process.env.npm_config_global === 'true') {
    console.warn('Plugin installed globally. Skipping copying plugin code.');
    return;
  }

  var root = process.cwd().replace(/(.+[\/\\])node_modules.+/, '$1');
  install(root);
} else {
  module.exports = install;
}