-- This script will get node and its data from the storage
--
-- KEYS[1] is the node ID.


local data = redis.call('HGETALL', KEYS[1])

if next(data) ~= nil then
  -- we have the node, return its data
  return data;
end


local _id = redis.call('HGET', '_userIdToRedisId', KEYS[1])
if _id then
  -- We have the node, but it does not have any data
  return {};
end

-- no such node exist
