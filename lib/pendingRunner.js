var Promise = require('bluebird');

module.exports = createPendingRunner;

function createPendingRunner() {
  var pending = [];
  var methods = ['addNode', 'addLink']

  var api = {
    forEachOperation: forEachOperation
  }

  methods.forEach(augmentPendingAPI);

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
