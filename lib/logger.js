'use strict';
let util = require('./util');
module.exports = function Logger(options) {
  util.enforceArgs(options, ['console', 'debug'], true);
  let con = options.console || console;
  let debug = options.debug || require('debug')('komprise');
  let self = {};
  self.log = function(...args) {
    con.log(...args);
  };
  self.error = function(...args) {
    con.error(...args);
  };
  self.debug = function(...args) {
    debug(...args);
  };
  self.log = self.log;
  return Object.freeze(self);
};
