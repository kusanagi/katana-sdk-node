'use strict';

const path = require('path');
const logger = require('./logger');
const yargs = require('yargs');

exports.parse = () => {
  const argv = yargs(process.argv)
    .strict(true)
    .option('framework-version', {
      alias: 'p',
      required: true,
      describe: 'Required version of the KATANA framework',
      type: 'string'
    })
    .option('component', {
      alias: 'c',
      required: true,
      choices: ['service', 'middleware'],
      describe: 'The type of the component. Either "middleware" or "service".',
      type: 'string'
    })
    .option('name', {
      alias: 'n',
      required: true,
      describe: 'The name of the component',
      type: 'string'
    })
    .option('version', {
      alias: 'v',
      required: true,
      describe: 'The version of the component',
      type: 'string'
    })
    .option('socket', {
      alias: 's',
      describe: 'Optional socket name for ZeroMQ',
      type: 'string'
    })
    .option('tcp', {
      alias: 't',
      describe: 'Optional tcp port that ZeroMQ uses for communication with the framework',
      type: 'string'
    })
    .option('var', {
      alias: 'V',
      describe: 'Optional variable defined in the configuration file for the engine',
      coerce: (arg) => {
        if (!arg) {
          return {};
        }
        let [k, v] = arg.split('=');
        return {[k]: v};
      },
    })
    .option('disable-compact-names', {
      alias: 'd',
      describe: 'Optional switch which if defined will enable full property names in all payloads',
      type: 'boolean'
    })
    .option('debug', {
      alias: 'D',
      describe: 'Enable debug mode. Prints all logs to stdout',
      type: 'boolean'
    })
    .option('callback', {
      alias: 'C',
      describe: 'Optional path to a local file with a payload to be used in a single execution',
      type: 'boolean'
    })
    .option('quiet', {
      alias: 'q',
      describe: 'Disable all output, even if in debug mode',
      type: 'boolean'
    })
    .argv;

    // Group vars
    argv.var = argv.V = !Array.isArray(argv.var) ? [argv.var] : argv.var;
    argv.var = argv.V = argv.var.reduce((total, curr) => Object.assign(total, curr), {});

    // Generate socket name
    if (!argv.socket) {
      argv.socket = `@katana-${argv.component}-${argv.name}-${argv.version.replace(/\./g, '-')}`;
    }

    // Set CWD
    argv.path = path.resolve(argv.$0);

    // Setup logger
    logger.setLevel(argv.debug ? logger.levels.DEBUG : logger.levels.INFO);

    return argv;
};
