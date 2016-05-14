module.exports = createScriptRunner;

function createScriptRunner(scripts, client) {
  var api = {
    merge: merge,

    addNode: addNode,
    addLink: addLink,
    getNode: getNode,
    forEachLinkedNode: forEachLinkedNode
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

  function forEachLinkedNode(nodeId, callback, kind) {
    kind = kind || '';
    console.log(kind);
    var command = [scripts.forEachLinkedNode, 1, nodeId, kind];

    return run(command).then(parseResult);

    function parseResult(result) {
      if (!result) return; // no such node, no iteration
      result = JSON.parse(result);

      if (kind === 'in') {
        iterate(result, 'in')
      } else if (kind === 'out') {
        iterate(result, 'out')
      } else {
        iterate(result,'in')
        iterate(result,'out')
      }
    }

    function iterate(hash, kind) {
      var links = hash[kind];
      if (!Array.isArray(links)) return;

      links.forEach(function(link) {
        var fromId, toId;

        if (kind === 'in') {
          fromId = link.id;
          toId = nodeId
        } else {
          fromId = nodeId
          toId = link.id
        }
        var args = {
          fromId: fromId,
          toId: toId
        };
        if (link.data) {
          args.data = unpackData(link.data);
        }

        callback(args)
      });
    }
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
