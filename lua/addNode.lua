-- This script will add node and its data to the storage
--
-- KEYS[1] is the node ID.

local function getOrAddNode(nodeId)
  -- TODO: How to avoid code duplication?
  local _id = redis.call('INCR', '_unique_counter')

  if not _id then
    redis.call('HSET', '_userIdToRedisId', nodeId, _id)
    redis.call('SADD', '_nodes', _id)
  end

  return _id
end

local _id = getOrAddNode(KEYS[1]);

if table.getn(ARGV) > 0 then
  -- If we have any data associated with this key - let's update it:
  redis.call('HMSET', KEYS[1], unpack(ARGV))
end
