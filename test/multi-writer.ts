/**
 * isolation test
 * */
import fs from 'fs'
import Level from 'level-ts'
import { LevelTransaction } from '../src'

fs.mkdirSync('db', { recursive: true })
const db = new Level('db')

async function main() {
  const t1 = new LevelTransaction(db)
  await t1.put('A', 1)
  await t1.commit()

  let A = await db.get('A')
  if (!A) { throw new Error('db not init') }
  console.log('Initial A:', A)

  const t2 = new LevelTransaction(db)
  const t3 = new LevelTransaction(db)

  t2.put('A', 2)
  t2.put('B', 2)

  t3.put('C', 1)

  await t2.commit()
  await t3.commit()

  A = await db.get('A')
  const B = await db.get('B')
  const C = await db.get('C')

  console.log('A:', A)
  console.log('B:', B) // B should be null? because t3 should commit whole world, not delta changes?
  console.log('C:', C)
}

main()
