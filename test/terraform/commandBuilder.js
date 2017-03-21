'use strict';
const TerraformCommandBuilder = require('../../lib/terraform/commandBuilder');
const should = require('should');

describe('Command Builder', () => {
  let tf;
  beforeEach(() => {
    tf = new TerraformCommandBuilder();
  });

  it('should build a command without args', () => {
    const command = 'info';
    const result = tf.command(command).build();
    const expected = 'terraform info';
    should(result).eql(expected);
  });

  it('should build a command with args', () => {
    const command = 'info';
    const result = tf.command(command).withArg('test', 'value').build();
    const expected = 'terraform info -test=value';
    should(result).eql(expected);
  });

  it('should handle args with quotations', () => {
    const command = 'info';
    const result = tf.command(command).withArg('test', '"another=value"').build();
    const expected = 'terraform info -test="another=value"';
    should(result).eql(expected);
  });
});
