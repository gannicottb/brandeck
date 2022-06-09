
import { createClient } from 'redis';

// workaround per https://github.com/redis/node-redis/issues/1673
type RedisClientType = ReturnType<typeof createClient>;

export class RedisClient {
  private static instance: RedisClient
  private client: RedisClientType

  private constructor() {
    const rc = createClient({
      url: process.env.REDIS_URL
    });

    rc.on('error', (err) => console.log('Redis Client Error', err));

    this.client = rc
  }
  public static async getInstance() {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
      // connect only once
      await RedisClient.instance.redis().connect()
    }
    return RedisClient.instance;
  }
  public redis() { return this.client }
}