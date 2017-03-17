'use strict';
let inquirer = require('inquirer');
let log = new require('./logger')();
let fs = require('fs');
let path = require('path');
let _ = require('lodash');

module.exports = function Init() {
  let kfile = path.join(process.env.PWD, 'komprise.json');
  let settings = {};
  let defaults;

  if(fs.existsSync(kfile)) {
    defaults = require(kfile);
  }

  let getDefault = (key) => {
    return _.get(defaults, key);
  };

  /* jshint maxparams: 5 */
  let defaultQuestion = (type, name, message, defaultKey, additional) => {
    return Object.assign({
      type: type,
      name: name,
      message: message,
      default: getDefault(defaultKey)
    }, additional);
  };

  let availableZones = {
    'europe-west1': ['europe-west1-b', 'europe-west1-c', 'europe-west1-d'],
    'us-east1': ['europe-east1-b', 'europe-east1-c', 'europe-east1-d']
  };

  let gcpAdditionalZones = () => {
    let primaryZone = settings.providers.gcp.primaryZone;
    let region = settings.providers.gcp.region;
    let questions = [
      defaultQuestion('checkbox', 'additionalZones', 'Additional Zones:', 'providers.gcp.additionalZones', {
        choices: _.without(availableZones[region], primaryZone),
        validate: function (answer) {
          if (answer.length < 1) {
            return 'You must pick at least one additional zone.';
          }
          return true;
        }
      })
    ];

    return inquirer.prompt(questions).then(function (answers) {
      settings.providers.gcp.additionalZones = answers.additionalZones;
    });
  };

  let gcpPrimaryZone = () => {
    let provider = settings.basic.provider;
    let questions = [
      defaultQuestion('list', 'primaryZone', 'Which should be the primary zone?', 'providers.gcp.primaryZone', {
        choices: availableZones[settings.providers[provider].region]
      })
    ];

    return inquirer.prompt(questions).then(function (answers) {
      settings.providers[provider] = Object.assign(answers, settings.providers[provider]);
      return gcpAdditionalZones();
    });
  };

  let gcpQuestions = () => {
    let questions = [
      defaultQuestion('input', 'projectName', 'What is the GCP project name?', 'providers.gcp.projectName'),
      defaultQuestion('list', 'region', 'Which should be the primary region?', 'providers.gcp.region', {
        choices: Object.keys(availableZones)
      })
    ];

    return inquirer.prompt(questions).then(function (answers) {
      settings.providers[settings.basic.provider] = answers;
      return gcpPrimaryZone();
    });
  };

  let basicQuestions = () => {
    let questions = [
      defaultQuestion('list', 'provider', 'Which cloud provider do you wish to use?', 'basic.provider', {
        choices: [
          { name: 'Google Cloud Platform', value: 'gcp' }
        ]
      }),
      defaultQuestion('input', 'stack', 'Please enter a short name for this stack:', 'basic.stack'),
      defaultQuestion('input', 'email', 'Please enter an email for LetsEncrypt', 'basic.email')
    ];

    return inquirer.prompt(questions).then(function (answers) {
      settings.basic = answers;
      settings.basic.bucket = settings.basic.stack + '-terraform';
      settings.providers = {};
    });
  };

  let self = {};

  self.save = function() {
    let json = JSON.stringify(settings, null, '  ');
    return inquirer.prompt({
      type: 'confirm',
      name: 'write',
      message: 'Does this look cool?'
    }).then(answers => {
      if(answers.write) {
        log.log('kompose.json saved to: ' + kfile);
        fs.writeFileSync(kfile, json);
      } else {
        log.error('aborting');
      }
    });
  };

  self.provider = function() {
    return gcpQuestions();
  };

  self.basic = basicQuestions;
  self.all = function() {
    return basicQuestions()
    .then(() => { return self.provider(); })
    .then(() => { return self.save(); });
  };
  return Object.freeze(self);
};
