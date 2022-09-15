const { createClient } = require('redis')
const redisServerURL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'

const client = createClient(redisServerURL)

client.on('error', (err) => console.log('Redis Client Error', err))

const connectClient = async () => {
    await client.connect()
}

connectClient()

module.exports = client