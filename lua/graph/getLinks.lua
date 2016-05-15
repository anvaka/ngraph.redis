local function getLinks(id, kind, cursor)
  local keyname = id .. '.' .. kind
  if not cursor then
    cursor = 0
  end

  local sscanResult = redis.call('SSCAN', keyname, cursor, 'COUNT', 500)

  local nextCursor = sscanResult[1]
  local redisIds = sscanResult[2]

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

  return result, nextCursor
end

return getLinks
