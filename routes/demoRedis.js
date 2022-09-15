const router = require('express').Router()
const client = require('../configRedis')

router.post('/set-item', async (req, res) => {
    const { key, value } = req.body

    try {
        const response = await client.set(key, value);
        res.status(200).json(response)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/get-item/:key', async (req, res) => {
    try {
        const response = await client.get(req.params.key)
        res.status(200).json(response)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router