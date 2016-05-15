-- This script will iterate over edges of a given node
--
-- KEYS[1] is the node ID.
-- ARGV[1] - in|out|nil - specifies whether only incoming (in) or outgoing (out)
-- should be returned. If not passed then both incoming and outgoing edges are returned

local getLinks = require('graph.getLinks')
local result = {}

local _id = redis.call('HGET', '_userIdToRedisId', KEYS[1])

if not _id then
  return {}
end

if ARGV[1] == 'in' then
  result['in'] = getLinks(_id, 'in')
elseif ARGV[1] == 'out' then
  result.out = getLinks(_id, 'out')
else
  result['in'] = getLinks(_id, 'in')
  result.out = getLinks(_id, 'out')
end

return cjson.encode(result)
