# ngraph.redis

This is all only theory. There is no implementation yet. Your feedback is welcome.

## Requirements

Evaluate redis as a storage for large directed graphs.

* Each graph node can have a type (e.g. `PERSON`, `REPOSITORY`, etc.) and data attributes.
  (e.g. `firstName`, `lastName`)
* Each node can be connected with any other node. Each connectoin can have a type.
  (e.g. `(PERSON) - [FOLLOWS] -> (REPOSITORY)` or `(PERSON) -> [CREATED] -> (REPOSITORY)`)
* The following operations should be O(1):
  - Add/Remove/Update/Lookup node
  - Add/Remove/Update/Lookup connectoin between two nodes
* There should be a way to get all incoming and outgoing connectoins for a given
  set of nodes.

Ideally I'd love to support [cypher-like](http://www.opencypher.org/) query language.

## Storage structure

We use node identifiers (`NODE_ID`) to refer to a node. Each identifier of a node
consist of two parts:

`NODE_TYPE:ID` - here `NODE_TYPE:` is optional prefix, which describes type of the
node (`PERSON`, `REPOSITORY`, etc.). `id` is a unique identifier within a set. Example:
`PERSON:anvaka`, `REPOSITORY:google/cayley`.

There are several data structures with predefined names:

* `nodes` - this is a SET of all nodes. Each element of the set is a node identifier.
* `EDGE_TYPE:NODE_ID:out` - this is a SET of all outgoing edges of a given `EDGE_TYPE`
from node with id `NODE_ID`. Each element of the set is adjacent node identifier.
* `EDGE_TYPE:NODE_ID:in` - this is a SET of all incoming edges of a given `EDGE_TYPE`
into node with id `NODE_ID`. Each element of the set is adjacent node identifier.
* `NODE_ID:data` - this is a HASH which stores data attributes for each node.

For example:

```
nodes -> [PERSON:anvaka, PERSON:thlorenz, REPOSITORY:google/cayley]

FOLLOWS:PERSON:anvaka:out -> [PERSON:thlorenz, REPOSITORY:google/cayley]
FOLLOWS:PERSON:thlorenz:in -> [PERSON:anvaka]

FOLLOWS:REPOSITORY:google/cayley:in -> [PERSON:anvaka]

PERSON:anvaka:data -> {
  name: 'Andrei Kashcha',
  location: 'Seattle'
}
...
```

# license

MIT
