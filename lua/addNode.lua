-- This script will add node and its data to the storage
--
-- KEYS[1] is the node ID.

local addNode = require('graph.addNode')

addNode(KEYS[1], ARGV)
