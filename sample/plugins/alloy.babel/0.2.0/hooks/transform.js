const path = require('path');
const fs = require('fs-extra');
const klawSync = require('klaw-sync');
const babel = require('babel-core');
const pug = require('pug');
const stss = require('stss');
const _ = require('lodash');
const replaceExt = require('replace-ext');
const chokidar = require('chokidar');
const BasePlugin = require('./plugin');

class TransformPlugin extends BasePlugin {
  constructor() {
    super();
    this.transform = this.transform.bind(this);
    this.handlePreConstruct = this.handlePreConstruct.bind(this);
    this.handlePreCompile = this.handlePreCompile.bind(this);
  }

  addHooks() {
    process.on('SIGINT', () => {
      if (this.watcher) {
        this.log('Process interrupted. Stopping watching.');
        this.watcher.close();
      }
    });

    process.on('exit', () => {
      if (this.watcher) {
        this.log('Process finished. Stopping watching.');
        this.watcher.close();
      }
    });

    this.cli.on('build.pre.construct', this.handlePreConstruct);
    this.cli.on('build.pre.compile', this.handlePreCompile);
  }

  handlePreConstruct(data, next) {
    this.log('Pre-construct');

    this.paths = {};
    this.paths.root = this.cli.argv['project-dir'];
    this.paths.src = path.join(this.paths.root, 'src');
    this.paths.app = path.join(this.paths.root, 'app');
    this.paths.build = path.join(this.paths.root, 'build');

    if (this.cli.argv.liveview) {
      this.log('Detected LiveView. Setting up watcher.');
      this.watcher = chokidar.watch(this.paths.src, { ignoreInitial: true })
        .on('change', path => {
          this.log(`${path} has been changed`);
          this.transform();
        })
        .on('add', path => {
          this.log(`${path} has been added`);
          this.transform();
        })
        .on('unlink', path => {
          this.log(`${path} has been removed`);
          this.transform();
        });
    }

    next();
  }

  handlePreCompile(data, next) {
    this.transform()
      .then(() => next())
      .catch(e => next(e));
  }

  transform() {
    const lockFilePath = path.join(this.paths.build, 'alloybabel.lock');
    return fs.pathExists(lockFilePath)
      .then(exists => {
        if (exists) {
          this.log(`Lock file found at ${lockFilePath}`);
          return fs.readJson(lockFilePath);
        }

        this.log(`Lock file not found at ${lockFilePath}. Cleaning app directory.`);
        return fs.remove(this.paths.app).then(() => ({}));
      })
      .then(lock => {
        const newLock = {};

        const filesToCopy = klawSync(this.paths.src, { nodir: true })
          .filter(({ path: filePath, stats: fileStats }) => {
            const newTime = fileStats.mtime.getTime();
            newLock[filePath] = newTime;
            return newTime !== lock[filePath];
          })
          .map(({ path }) => path);

        return !_.isEqual(newLock, lock) && Promise.all(filesToCopy.map(filePath => {
          // copy new files
          const relativePath = path.relative(this.paths.src, filePath);
          this.log(`Copying ${relativePath}`);
          return fs.copy(filePath, path.join(this.paths.app, relativePath));
        })).then(() => {
          // transform files
          return Promise.all(filesToCopy.map(path => this.transformFile(path)));
        }).then(() => {
          // remove outdated files
          const filesToRemove = _.difference(Object.keys(lock), Object.keys(newLock))
            .map(filePath => path.join(this.paths.app, path.relative(this.paths.src, filePath)));
          return Promise.all(filesToRemove.map(path => {
            this.log(`Removing ${path}`);
            return fs.remove(path);
          }));
        }).then(() => {
          // write lock file
          this.log(`Writing new lock file to ${lockFilePath}`);
          return fs.writeJson(lockFilePath, newLock, { spaces: 2 });
        });
      })
      .catch(error => {
        this.log('Failed transforming project!', 'error');
        this.log(error, 'exception');
        return Promise.reject(error);
      });
  }

  transformFile(srcFilePath) {
    const extension = path.extname(srcFilePath);
    const filePath = path.join(this.paths.app, path.relative(this.paths.src, srcFilePath));
    switch (extension) {
    case '.js':
      return this.transformJs(filePath);
    case '.stss':
      return this.transformStss(filePath);
    case '.pug':
    case '.jade':
      return this.transformPug(filePath);
    default:
      return Promise.resolve();
    }
  }

  transformJs(filePath) {
    this.log(`Transforming JS with Babel ${filePath} -> ${filePath}`);
    return new Promise((resolve, reject) => {
      babel.transformFile(filePath, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    }).then(({ code }) => fs.writeFile(filePath, code));
  }

  transformPug(filePath) {
    const xmlContent = pug.renderFile(filePath, { pretty: true, doctype: 'xml' });
    const xmlFilePath = replaceExt(filePath, '.xml');
    this.log(`Transforming Pug file ${filePath} -> ${xmlFilePath}`);
    return fs.outputFile(xmlFilePath, xmlContent)
      .then(() => fs.remove(filePath));
  }

  transformStss(filePath) {
    const tssFilePath = replaceExt(filePath, '.tss');
    this.log(`Transforming STSS file ${filePath} -> ${tssFilePath}`);
    return new Promise((resolve, reject) => stss.render({
      file: filePath,
      success: resolve,
      error: reject
    }))
      .then(tss => fs.outputFile(tssFilePath, tss))
      .then(() => fs.remove(filePath));
  }
}

module.exports = new TransformPlugin();