import { RedisClient } from "./RedisClient"
import { ReadThroughCache } from "./ReadThroughCache"
import { debugLog } from "./Utils"

// Redis works in strings pretty exclusively, so if I really wanted
// to be polymorphic in V, I would need a deserializing fn
export class RedisRTC<K> extends ReadThroughCache<K, string> {
  namespace: string
  constructor(namespace: string, fn: (key: K) => Promise<string>) {
    super(fn)
    this.namespace = namespace
  }

  buildKeyString(key: K) {
    return `brandeck:${this.namespace}:${JSON.stringify(key)}`
  }

  async get(key: K): Promise<string> {
    const keyString = this.buildKeyString(key)
    const redis = await RedisClient.getInstance().then((c) => c.redis())

    let cached = await redis.get(keyString)
    if (cached == null) {
      debugLog(`cache miss! for ${keyString}`)
      await this.fn(key).then(
        (v: string) => { // if the function resolved,
          redis.set(keyString, v) // set the new value
          debugLog(`cache SET for ${keyString}`)
          cached = v // return the new value
        },
        (reason) => { // if the function was rejected, don't persist anything
          debugLog(reason)
        }
      )
    } else {
      debugLog(`cache hit :) for ${keyString}`)
    }
    return (cached || "unknown")
  }

  async invalidate(key: K): Promise<void> {
    const keyString = this.buildKeyString(key)
    const redis = await RedisClient.getInstance().then((c) => c.redis())
    debugLog(`cache DEL for ${keyString}`)
    redis.del(keyString)
  }
}
