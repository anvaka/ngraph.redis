-- This script will add link and its data to the storage.
--
-- KEYS[1] fromId
-- KEYS[2] toId
-- ARGV link data

local function getOrAddNode(nodeId)
  -- TODO: How to avoid code duplication?
  local _id = redis.call('HGET', '_userIdToRedisId', nodeId)

  if not _id then
    _id = redis.call('INCR', '_nextNodeId')

    redis.call('HSET', '_userIdToRedisId', nodeId, _id)
    redis.call('SADD', '_nodes', _id)
  end

  return _id
end

local _fromId = getOrAddNode(KEYS[1]);
local _toId = getOrAddNode(KEYS[2]);

-- NOTE: this design prohibits multiedges (since we are using sets)
redis.call('SADD', _fromId .. '.out', _toId);
redis.call('SADD', _toId .. '.in', _fromId);

if table.getn(ARGV) > 0 then
  -- If we have any data associated with this edge - let's update it:
  redis.call('HMSET', _fromId .. '.' .. _toId, unpack(ARGV))
end
