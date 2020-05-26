# level-transactions-ts

Transaction layer for leveldb

[![npm Package Version](https://img.shields.io/npm/v/level-transactions-ts.svg?maxAge=3600)](https://www.npmjs.com/package/level-transactions-ts)

## Features
- ACID (atomic, consistent, isolated, durable)
- promise return

## Remark
The isolation is delta-change-based, not complete-state (whole-world) based.

It allows multiple write-txn, and the delta change will be saved.

If your application logic do write conditionally based on the read result, it may breaks the logic if the read result is affected by another txn commit earlier.

For example:
```
initial: A = 0

tx1: set A = 1

tx2: if A = 0, set B = 1

tx1: commit (set A=1)

tx2: commit (set B=1)
```
This may be undesired result depending on the application logic.
