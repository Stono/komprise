'use strict';
const deride = require('deride');
const Terraform = require('../../lib/terraform');

describe('Terraform', () => {
  let tf, mockExec;
  beforeEach(() => {
    mockExec = deride.stub(['command']);
    mockExec.setup.command.toCallbackWith(null);
    tf = new Terraform({
      project: 'project',
      stack: 'stack',
      exec: mockExec
    });
  });

  describe('Remote State', () => {
    it('should execute the correct remote state command', done => {
      const expected = 'terraform init -backend=true -get=true -input=false -backend-config=bucket=stack-terraform -backend-config=path=mymodule.tfstate -backend-config=project=project';
      const stateConfigured = () => {
        mockExec.expect.command.called.withArg(expected);
        done();
      };

      tf.configureRemoteState({
        name: 'mymodule'
      }, stateConfigured);
    });
  });
});
