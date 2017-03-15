'use strict';
let util = require('./util');
module.exports = function Logger(options) {
  util.enforceArgs(options, ['console', 'debug'], true);
  let con = options.console || console;
  let debug = options.debug || require('debug')('komprise');
  let self = {};
  self.info = function(...args) {
    con.log(...args);
  };
  self.error = function(...args) {
    con.error(...args);
  };
  self.debug = function(...args) {
    debug(...args);
  };
  return Object.freeze(self);
};
