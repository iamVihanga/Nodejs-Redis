const router = require('express').Router()
const redisClient = require('../configRedis')
const Post = require('../model/Post')


// Get Posts
router.get('/', async (req, res) => {
    try {
        const allPosts = await Post.find()
        allPosts.forEach(async post => {
            const postExsits = await redisClient.get(`post-${post._id}`)
            if (!postExsits) {
                await redisClient.set(`post-${post._id}`, JSON.stringify(post), "EX", 50)
            }
        })

        // res.status(200).render('posts', { allPosts })
        res.status(200).json(allPosts)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get single post
router.get('/:id', async (req, res) => {
    try {
        const cacheResponse = await redisClient.get(`post-${req.params.id}`)
        if (cacheResponse) {
            return res.status(200).json(JSON.parse(cacheResponse))
            // res.status(200).render('singlePost', { post: JSON.parse(cacheResponse) })
        } else {

            // Otherwise, add response to cache
            const response = await Post.findById(req.params.id)
            await redisClient.set(`post-${response._id}`, JSON.stringify(response))

            res.status(200).json(response)
            // res.status(200).render('singlePost', { post: response })
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

// Create post
router.post('/create', async (req, res) => {
    try {
        const post = new Post(req.body)

        const response = await post.save()
        res.status(200).json(response)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Update post
router.put('/update/:id', async (req, res) => {
    try {
        const response = await Post.findByIdAndUpdate(req.params.id, req.body)

        // Check post was exsits in cache and update cache data
        const cacheData = await redisClient.get(`post-${req.params.id}`)
        if (cacheData) {
            await redisClient.set(`post-${req.params.id}`, JSON.stringify(response))
        }

        res.status(200).json(response)
    } catch (err) {
        res.status(500).json(err)
    }
})



module.exports = router