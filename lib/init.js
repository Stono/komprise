'use strict';
let inquirer = require('inquirer');
let exec = require('./exec');
let log = new require('./logger')();
let fs = require('fs');
let path = require('path');
let lodash = require('lodash');

module.exports = function Init() {
  let kfile = path.join(process.env.PWD, 'komprise.json');
  let settings = {};
  let defaults;

  if(fs.existsSync(kfile)) {
    defaults = require(kfile);
  };

  let getDefault = (key) => {
    return lodash.get(defaults, key);
  };

  let defaultQuestion = (type, name, message, defaultKey, additional) => {
    return Object.assign({
      type: type,
      name: name,
      message: message,
      default: getDefault(defaultKey)
    }, additional);
  };

  let output = () => {
    let json = JSON.stringify(settings, null, '  ')
    console.log(json);
    inquirer.prompt({
      type: 'confirm',
      name: 'write',
      message: 'Does this look cool?'
    }).then(answers => {
      if(answers.write) {
        fs.writeFileSync(kfile, json);
      } else {
        log.log('aborting')
      }
    });
  };

  let gcpRegion = () => {
    let availableZones = {
      'europe-west1': ['europe-west1-b', 'europe-west1-c', 'europe-west1-d'],
      'us-east1': ['europe-east1-b', 'europe-east1-c', 'europe-east1-d']
    };
    let provider = settings.basic.provider;
    let questions = [
      defaultQuestion('list', 'primaryZone', 'Which should be the primary zone?', 'providers.gcp.primaryZone', {
        choices: availableZones[settings.providers[provider].region]
      })
    ];

    inquirer.prompt(questions).then(function (answers) {
      settings.providers[provider] = Object.assign(answers, settings.providers[provider]);
      output();
    });
  };

  let gcpQuestions = () => {
    let questions = [
      defaultQuestion('input', 'projectName', 'What is the GCP project name?', 'providers.gcp.projectName'),
      defaultQuestion('list', 'region', 'Which should be the primary region?', 'providers.gcp.region', {
        choices: ['europe-west1', 'us-east1']
      })
    ];

    inquirer.prompt(questions).then(function (answers) {
      settings.providers[settings.basic.provider] = answers;
      gcpRegion();
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

    inquirer.prompt(questions).then(function (answers) {
      settings.basic = answers;
      settings.basic.bucket = settings.basic.stack + '-terraform';
      settings.providers = {};
      gcpQuestions();
    });
  };

  let self = {};
  self.config = basicQuestions;
  return Object.freeze(self);
};