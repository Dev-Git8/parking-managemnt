const { createClient } = require('redis');

let isConnected = false;

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        reconnectStrategy: false // Prevents infinite connection spam if Redis is uninstalled
    }
});

redisClient.on('error', (err) => {
    if (isConnected) console.log('Redis Client Error', err);
    isConnected = false;
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
    isConnected = true;
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('\x1b[33m%s\x1b[0m', '⚠️ Warning: Could not connect to Redis. Caching will be skipped and Database will be used directly. Please start a Redis server on port 6379 to enable caching.');
    }
};

const isRedisConnected = () => isConnected;

module.exports = {
    redisClient,
    connectRedis,
    isRedisConnected
};
