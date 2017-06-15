class BasePlugin {
  constructor() {
    this.version = '0.2.0';
    this.cliVersion = '>=3.x';
  }

  init(logger, config, cli) {
    this.logger = logger;
    this.config = config;
    this.cli = cli;

    this.addHooks();
  }

  addHooks() {
  }

  log(message, level = 'info') {
    level = this.logger[level] ? level : 'info';
    this.logger[level](message);
  }
}

module.exports = BasePlugin;