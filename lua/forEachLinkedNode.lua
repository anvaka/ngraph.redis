-- This script will iterate over edges of a given node
--
-- KEYS[1] is the node ID.
-- ARGV[1] - in|out|nil - specifies whether only incoming (in) or outgoing (out)
-- should be returned. If not passed then both incoming and outgoing edges are returned

local _id = redis.call('HGET', '_userIdToRedisId', KEYS[1])

if not _id then
  return {}
end

local function getLinks(id, kind)
  -- todo: it's probably better to use SSCAN, so that we do not block redis
  local keyname = _id .. '.' .. kind
  local redisIds = redis.call("SMEMBERS", keyname)

  if table.getn(redisIds) == 0 then
    return {}
  end

  local otherIds = redis.call("HMGET", "_redisIdToUserId", unpack(redisIds))
  local result = {}

  table.foreach(otherIds, function(idx, value)
    local link = {
      id = value
    }

    local otherId = redisIds[idx]

    local linkDataKey
    if kind == 'in' then
      linkDataKey = otherId .. '.' .. id
    else
      linkDataKey = id .. '.' .. otherId
    end

    local data = redis.call('HGETALL', linkDataKey)
    if table.getn(data) > 0 then
      link.data = data
    end

    table.insert(result, link)
  end)

  return result
end

local result = {}

if ARGV[1] == 'in' then
  result['in'] = getLinks(_id, 'in')
elseif ARGV[1] == 'out' then
  result.out = getLinks(_id, 'out')
else
  result['in'] = getLinks(_id, 'in')
  result.out = getLinks(_id, 'out')
end

return cjson.encode(result)
