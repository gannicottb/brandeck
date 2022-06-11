import { RedisClient } from "./RedisClient"
import { ReadThroughCache } from "./ReadThroughCache"

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
      await this.fn(key).then(
        (v: string) => {
          redis.set(keyString, v) // set the new value
          cached = v // return the new value
        },
        (reason) => {
          console.log(reason)
        }
      )
    } else {
      console.log(`cache hit :) for ${keyString}`)
    }
    return (cached || "unknown")
  }
}
