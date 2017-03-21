'use strict';
const spawn = require('child_process').spawn;
const spawnSync = require('child_process').spawnSync;
const util = require('./util');
const Logger = require('./logger');

require('colors');

const Exec = function(options) {
  options = util.defaultValue(options, {});
  const p = util.defaultValue(options.process, process);
  const logger = util.defaultValue(options.logger, new Logger());
  const self = {};

  const async = (root, args, options, done) => {
    let stdout = '';
    let stderr = '';
    const spawnOpts = {
      stdio: [
        p.stdin, 'pipe', 'pipe'
      ]
    };
    if(options.cwd) {
      spawnOpts.cwd = options.cwd;
    }
    const proc = spawn(root, args, spawnOpts);

    proc.stdout.on('data', data => {
      if(options.output) { p.stdout.write(data.toString()); }
      stdout = stdout + data.toString();
    });

    proc.stderr.on('data', data => {
      if(options.output) { p.stderr.write(data.toString().red); }
      stderr = stderr + data.toString();
    });

    proc.on('error', err => {
      if(options.exit) {
        console.log(stdout);
        console.error(stderr);
        p.exitCode = 1;
        p.exit(1);
      }
      done(err, {
        stdout: stdout,
        stderr: stderr
      }, 1);
    });

    proc.on('exit', code => {
      if(code !== 0 && options.exit) {
        console.log(stdout);
        console.error(stderr);
        p.exitCode = code;
        p.exit(code);
      }

      done(null, {
        stdout: stdout,
        stderr: stderr,
        code: code
      });
    });
  };

  const sync = (root, args, options) => {
    const proc = spawnSync(root, args, options);
    return {
      stdout: proc.stdout.toString(),
      stderr: proc.stderr.toString()
    };
  };

  self.command = function(command, options, done) {
    options = util.defaultValue(options, {});
    options.exit = util.defaultValue(options.exit, false);
    options.output = util.defaultValue(options.output, false);
    const args = command.split(' ');
    const root = args.shift();
    logger.log(' ->', root.cyan, args.join(' '));
    return async(root, args, options, done);
  };

  self.commandSync = function(command, options) {
    options = util.defaultValue(options, {});
    options.exit = util.defaultValue(options.exit, false);
    options.output = util.defaultValue(options.output, false);
    const args = command.split(' ');
    const root = args.shift();
    logger.log(' ->', root.cyan, args.join(' '));
    return sync(root, args, options);
  };

  return Object.freeze(self);
};
module.exports = Exec;
