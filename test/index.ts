import fs from 'fs'
import Level from 'level-ts'
import { LevelTransaction } from '../src'

// const level = require('level')

export function test() {
  // fs.rmdirSync('db', { recursive: true })
  fs.mkdirSync('db', { recursive: true })
  // const db = level('db')
  const db = new Level('db')
  const tx1 = new LevelTransaction(db)
  const tx2 = new LevelTransaction(db)
  const key = 'foo'

  async function test(txn: LevelTransaction, i: number) {
    const res = [
      await txn.get(key).catch(() => null),
      txn.put(key, i),
      await txn.get(key).catch(() => null),
    ]
    await txn.commit()
    console.log('res' + i, res)
    if (res[1] !== res[2]) {
      throw new Error('not consistent')
    }
  }

  test(tx1, 1).catch(err => {
    console.error('err1', err)
    process.exit(1)
  })

  test(tx2, 2).catch(err => {
    console.error('err2', err)
    process.exit(1)
  })
}

test()
