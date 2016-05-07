-- This script will add node and its data to the storage
--
-- KEYS[1] is the node ID.
-- TODO: Do I need to pass _unique_counter as a second KEYS[2]?

local hasKey = redis.call('HEXISTS', KEYS[1], '_id')

if (hasKey == 1) then
  -- this means that the node with our id is already created.
  -- We are going to update its set of attributes:
  redis.call('HMSET', KEYS[1], unpack(ARGV))
else
  -- This is a new node. Update the unique counter and then set node data
  local _id = redis.call('incr', '_unique_counter')
  redis.call('HMSET', KEYS[1], '_id', _id, unpack(ARGV))
end
