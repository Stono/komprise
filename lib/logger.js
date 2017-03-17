'use strict';
let util = require('./util');
let colors = require('colors');
module.exports = function Logger(options) {
  options = util.defaultValue(options, {});
  let con = util.defaultValue(options.console, console);
  let debug = util.defaultValue(options.debug, () => { require('debug')('komprise'); });
  let self = {};
  self.log = function(...args) {
    con.log(...args);
  };
  self.error = function(...args) {
    con.error(colors.red(...args));
  };
  self.debug = function(...args) {
    debug(...args);
  };
  self.log = self.log;
  return Object.freeze(self);
};
