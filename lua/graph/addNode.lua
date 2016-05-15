local function addNode(nodeId, data)
  local _id = redis.call('HGET', '_userIdToRedisId', nodeId)

  if not _id then
    _id = redis.call('INCR', '_nextNodeId')

    redis.call('HSET', '_userIdToRedisId', nodeId, _id)
    redis.call('HSET', '_redisIdToUserId', _id, nodeId)
  end

  if data and table.getn(data) > 0 then
    -- If we have any data associated with this key - let's update it:
    redis.call('HMSET', nodeId, unpack(data))
  end

  return _id
end

return addNode
