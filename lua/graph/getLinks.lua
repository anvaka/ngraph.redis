local function getLinks(id, kind)
  -- todo: it's probably better to use SSCAN, so that we do not block redis
  local keyname = id .. '.' .. kind
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

return getLinks
