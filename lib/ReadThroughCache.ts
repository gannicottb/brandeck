import { RedisClient } from "./RedisClient"

abstract class ReadThroughCache<K, V> {
  fn: (key: K) => Promise<V>

  constructor(fn: (key: K) => Promise<V>) {
    this.fn = fn
  }

  abstract get(key: K): Promise<V>
}

// Redis works in strings pretty exclusively, so if I really wanted
// to be polymorphic in V, I would need a deserializing fn
export class RedisRTC<K> extends ReadThroughCache<K, string> {
  constructor(fn: (key: K) => Promise<string>) {
    super(fn)
  }

  async get(key: K): Promise<string> {
    const keyString = JSON.stringify(key)
    const redis = await RedisClient.getInstance().then((c) => c.redis())

    let cached = await redis.get(keyString)
    if (cached == null) {
      console.log(`cache miss! for ${keyString}`)
      const fresh = await this.fn(key)//.then((v) => String(v))
      await redis.set(keyString, fresh)
      cached = fresh
    } else {
      console.log(`cache hit :) for ${keyString}`)
    }
    return cached
  }
}

export class InMemoryRTC<K, V> extends ReadThroughCache<K, V> {
  cache = require('memory-cache');

  constructor(fn: (key: K) => Promise<V>) {
    super(fn)
  }

  async get(key: K): Promise<V> {
    const keyString = JSON.stringify(key)
    let cached = this.cache.get(keyString)
    if (cached == null) {
      console.log(`cache miss! for ${keyString}`)
      const fresh = await this.fn(key)
      this.cache.put(keyString, fresh)
      cached = fresh
    } else {
      console.log(`cache hit :) for ${keyString}`)
    }
    return cached
  }
}