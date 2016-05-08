module.exports = createScriptRunner;

function createScriptRunner(scripts, client) {
  var api = {
    merge: merge,

    addNode: addNode,
    addLink: addLink
  };

  return api;

  function addLink(fromId, toId, data) {
    var command = [scripts.addLink.sha, 0];
    addDataToCommand(data, command);

    return run(command);
  }

  function addNode(nodeId, data) {
    var command = [scripts.addNode.sha, 1, nodeId];
    addDataToCommand(data, command);

    return run(command);
  }


  function merge(previousScripts) {
    previousScripts.forEachOperation(callOperation);
  }

  function run(command) {
    return client.evalshaAsync.apply(client, command);
  }

  function callOperation(operation) {
    operation(api);
  }
}

function addDataToCommand(data, command) {
  if (!data) return;

  var packedArgs = pack(data)
  command = command.concat(packedArgs);
}

function pack(obj) {
  return Object.keys(obj).reduce(function(prev, current) {
    prev.push(current, obj[current]);
    return prev;
  }, [])
}
