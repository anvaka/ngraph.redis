module.exports = createScriptRunner;

function createScriptRunner(scripts, client) {
  var api = {
    merge: merge,

    addNode: addNode,
    addLink: addLink,
    getNode: getNode
  };

  return api;

  function addLink(fromId, toId, data) {
    var command = [scripts.addLink, 2, fromId, toId];
    command = addDataToCommand(data, command);

    return run(command);
  }

  function addNode(nodeId, data) {
    var command = [scripts.addNode, 1, nodeId];
    command = addDataToCommand(data, command);

    return run(command);
  }

  function getNode(nodeId) {
    var command = [scripts.getNode, 1, nodeId];
    return run(command).then(function(response) {
      if (response === null) return null;

      var node = {
        id: nodeId
      };

      if (response.length > 0) {
        node.data = unpackData(response)
      }

      return node;
    });
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

function unpackData(response) {
  var result = Object.create(null);

  for (var i = 0; i < response.length; i += 2) {
    var key = response[i];
    var value = JSON.parse(response[i + 1]); // TODO: json may be not very memory efficient for primitive types

    result[key] = value;
  }

  return result;
}

function addDataToCommand(data, command) {
  if (!data) return command;

  var packedArgs = pack(data)
  return command.concat(packedArgs);
}

function pack(obj) {
  return Object.keys(obj).reduce(function(prev, current) {
    // make it flat
    var value = JSON.stringify(obj[current]);
    prev.push(current, value);
    return prev;
  }, [])
}
