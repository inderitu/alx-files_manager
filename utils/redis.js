import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
    constructor() {
        this.client = createClient();
        this.client.on('error', err => console.log('Redis Client Error', err));
    }

    // check redis is connected
    isAlive() {
        if (this.client.connected) {
            return true;
        }
        return false;
    }

    async get(key) {
        const getAsync = promisify(this.client.get).bind(this.client);
        const val = await getAsync(key);
        return val;
    }

    async set(key, value, time) {
        const setAsync = promisify(this.client.set).bind(this.client);
        await setAsync(key, value);
        await this.client.expire(key, time);
    }

    async del(key) {
        const delAsync = promisify(this.client.del).bind(this.client);
        await delAsync(key);
    }
}

const redisClient = new RedisClient();

module.exports = redisClient;
