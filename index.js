var eventify = require('ngraph.events');
var loadScripts = require('./lib/loadScripts.js');
var createScriptRunner = require('./lib/scriptRunner.js');
var createPendingRunner = require('./lib/pendingRunner.js');
var bluebird = require('bluebird');

module.exports = createGraph;
module.exports.promisify = promisify;

function createGraph(client) {
  var scriptRunner = createPendingRunner();

  var api = {
    addNode: addNode,
    addLink: addLink,

    forEachLink: forEachLink,
    forEachNode: forEachNode,
    getNode: getNode,
    getLink: getLink
  };

  eventify(api);

  loadScripts(client, setScriptRunner);

  return api;

  function addNode(nodeId, data) {
    return scriptRunner.addNode(nodeId, data);
  }

  function addLink(fromId, toId, data) {
    return scriptRunner.addLink(fromId, toId, data)
  }

  function forEachLink() {
    
  }

  function getNode() {
    
  }

  function getLink() {
    
  }

  function forEachNode() {
    
  }

  function setScriptRunner(scripts) {
    // Replace pending script runner with actual script runner. If client
    // issued any commands before we were able to load all scripts into redis
    // instance, they will be stored in previous instance of script runner.
    // Actual script runner will take them and merge.
    var redisRunner = createScriptRunner(scripts, client);
    redisRunner.merge(scriptRunner);
    scriptRunner = redisRunner;
  }
}

function promisify(redis) {
  bluebird.promisifyAll(redis.RedisClient.prototype);
  bluebird.promisifyAll(redis.Multi.prototype);
}
