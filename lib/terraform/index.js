'use strict';
const util = require('../util');
const Exec = require('../exec');
const TerraformCommandBuilder = require('./commandBuilder');

module.exports = function Terraform(tfOptions) {
  util.enforceNotEmpty(tfOptions);
  util.enforceArgs(tfOptions, ['project', 'stack']);
  tfOptions.exec = util.defaultValue(tfOptions.exec, () => { return new Exec(); });
  const self = {};

  self.configureRemoteState = function(rsOptions, done) {
    util.enforceNotEmpty(rsOptions);
    util.enforceArgs(rsOptions, ['name'], true);

    const command = new TerraformCommandBuilder()
    .command('init')
    .withArg('backend', true)
    .withArg('get', true)
    .withArg('input', false)
    .withArg('backend-config', `bucket=${tfOptions.stack}-terraform`)
    .withArg('backend-config', `path=${rsOptions.name}.tfstate`)
    .withArg('backend-config', `project=${tfOptions.project}`);

    tfOptions.exec.command(command.build(), null, done);
  };

  self.plan = function(options) {
    util.enforceNotEmpty(options);
    util.enforceArgs(options, [], true);
  };

  return Object.freeze(self);
};
