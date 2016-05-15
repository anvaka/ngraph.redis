local addNode = require('graph.addNode')

local function addLink(fromId, toId, data)
  local _fromId = addNode(fromId);
  local _toId = addNode(toId);

  -- NOTE: this design prohibits multiedges (since we are using sets)
  redis.call('SADD', _fromId .. '.out', _toId);
  redis.call('SADD', _toId .. '.in', _fromId);

  if data and table.getn(data) > 0 then
    -- If we have any data associated with this edge - let's update it:
    redis.call('HMSET', _fromId .. '.' .. _toId, unpack(data))
  end
end

return addLink
