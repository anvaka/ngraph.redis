/**
 * The primary purpose of this file is to let client execute graph commands
 * without a need for redis connection. Once redis is connected, the control
 * is transfered over to ./scriptRunner.js. ./scriptRunner will request all
 * pending commands and resolve promises once actual redis commands are finished.
 */
var Promise = require('bluebird');
var allScripts = require('./allScripts.js');

module.exports = createPendingRunner;

function createPendingRunner() {
  var pending = [];

  var api = {
    forEachOperation: forEachOperation
  }

  allScripts.forEach(augmentPendingAPI);

  return api;

  function forEachOperation(cb) {
    pending.forEach(function(op) {
      cb(op);
    });
    // TODO: flush?
  }

  function augmentPendingAPI(name) {
    api[name] = function() {
      var args = arguments;

      return new Promise(function(resolve, reject) {
        pending.push(function(api) {
          api[name].apply(api, args).then(resolve, reject);
        });
      });
    }
  }
}
