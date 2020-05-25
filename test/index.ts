import fs from 'fs'
import { LevelTransaction } from '../src'

const level = require('level')

export function test() {
  // fs.rmdirSync('db', { recursive: true })
  fs.mkdirSync('db', { recursive: true })
  const db = level('db')
  const tx1 = new LevelTransaction(db)
  const tx2 = new LevelTransaction(db)
  const key = 'foo'

  async function test(txn: LevelTransaction, i: number) {
    return [
      await txn.get(key).catch(() => null),
      txn.put(key, i),
      await txn.get(key).catch(() => null),
      await txn.commit(),
    ]
  }

  test(tx1, 1)
    .then(res => console.log('res1', res))
    .catch(err => console.error('err1', err))

  test(tx2, 2)
    .then(res => console.log('res2', res))
    .catch(err => console.error('err2', err))
}

test()
