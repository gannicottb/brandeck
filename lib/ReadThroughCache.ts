export abstract class ReadThroughCache<K, V> {
  fn: (key: K) => Promise<V>

  constructor(fn: (key: K) => Promise<V>) {
    this.fn = fn
  }

  abstract get(key: K): Promise<V>
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