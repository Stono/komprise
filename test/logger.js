'use strict';
let Logger = require('../lib/logger');
let deride = require('deride');

describe('Logger', () => {
  let logger, mockConsole, debug;
  beforeEach(() => {
    mockConsole = deride.stub(['log', 'error']);
    debug = deride.func();
    logger = new Logger({
      console: mockConsole,
      debug: debug
    });
  });
  it('should write info messages', () => {
    logger.info('testing');
    mockConsole.expect.log.called.withArg('testing');
  });
  it('should write error messages', () => {
    logger.error('testing');
    mockConsole.expect.error.called.withArg('testing');
  });
  it('should log debug to debug, not console', () => {
    logger.debug('testing');
    debug.expect.called.withArg('testing');
    mockConsole.expect.log.called.never();
  });
});
