'use strict';
module.exports = function TerraformCommandBuilder() {
  let self = {};
  let command;
  let args = [];
  self.withArg = function(key, value) {
    args.push({ key: key, value: value});
    return self;
  };
  self.command = function(c) {
    command = c;
    return self;
  };
  self.build = () => {
    const mapped = args.map(arg => {
      return `-${arg.key}=${arg.value}`;
    }).join(' ');
    return `terraform ${command} ${mapped}`.trim();
  };
  return Object.freeze(self);
};
