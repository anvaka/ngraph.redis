/**
 * This module loads lua scripts into redis instance
 */
module.exports = loadScripts;

var path = require('path');
var fs = require('fs');

/**
 * Scripts hold information about every script that needs to be loaded.
 * Once done callback is called, each instance will have `sha` attached,
 * so that client can ran EVALSHA.
 */
var scripts = {
  addNode: {
    file: 'addNode.lua'
  },
  addLink: {
    file: 'addLink.lua'
  }
};

function loadScripts(client, done) {
  var allScripts = Object.keys(scripts);
  var remaining = allScripts.length;

  allScripts.forEach(loadScript);

  function loadScript(name) {
    var file = scripts[name].file;
    console.log('Loading', file);

    var script = path.join(__dirname, '..', 'lua', file);
    fs.readFile(script, 'utf8', evalFile);

    function evalFile(err, content) {
      if (err) throw new Error(err);
      client.script('load', content, rememberSha);
    }

    function rememberSha(err, sha) {
      if (err) throw new Error(err);
      scripts[name].sha = sha;
      markAsLoaded();
    }
  }

  function markAsLoaded() {
    remaining -= 1;
    if (remaining === 0) {
      done(scripts);
    }
  }
}
