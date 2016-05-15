-- This script will add link and its data to the storage.
--
-- KEYS[1] fromId
-- KEYS[2] toId
-- ARGV link data

local addLink = require('graph.addLink')

addLink(KEYS[1], KEYS[2], ARGV)
