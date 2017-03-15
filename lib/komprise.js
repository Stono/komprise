/*
 * komprise
 * https://github.com/Stono/komprise
 *
 * Copyright (c) 2017 Karl Stoney
 * Licensed under the Apache-2.0 license.
 */

'use strict';

module.exports = function() {
  let self = {};
  self.execute = function() {
    return 'awesome';
  };

  return Object.freeze(self);
};
