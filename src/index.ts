import Level from 'level-ts'

export type TransactionOp<T = any> =
  | {
      type: 'del'
      key: string
    }
  | {
      type: 'put'
      key: string
      value: T
    }

export interface LevelInstance {
  batch(ops: TransactionOp, cb: (err: any) => any): any
}

export class LevelTransaction<T = any> {
  pool = new Map<string, T | null>()
  ops: TransactionOp[] = []

  // tslint:disable-next-line ban-types
  constructor(public db: Level, public level: LevelInstance = (db as any).DB) {
    if (!level) {
      throw new Error('missing level instance')
    }
    if (typeof level.batch !== 'function') {
      throw new TypeError('missing .batch in level instance')
    }
  }

  del(key: string) {
    this.ops.push({ type: 'del', key })
    this.pool.set(key, null)
  }

  async get(key: string) {
    if (this.pool.has(key)) {
      const value = this.pool.get(key)
      if (value === null) {
        throw new Error('NotFoundError')
      }
      return value
    }
    return this.db.get(key)
  }

  async exists(key: string): Promise<boolean> {
    if (this.pool.has(key)) {
      return this.pool.get(key) === null
    }
    return this.db.exists(key)
  }

  async merge(key: string, config: Partial<T>): Promise<T> {
    let value = {} as T
    if (await this.exists(key)) {
      value = await this.get(key)
    }
    value = Object.assign({}, value, config)
    this.put(key, value)
    return value
  }

  put(key: string, value: T) {
    this.ops.push({ type: 'put', key, value })
    this.pool.set(key, value)
    return value
  }

  commit(): Promise<T[]> {
    return new Promise((resolve, reject) => {
      ; (this.db as any).DB.batch(this.ops, (err: any) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}
