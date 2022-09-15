if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const demoRedis = require('./routes/demoRedis')
const postsRouter = require('./routes/posts')
const mongoose = require('mongoose')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())

// Server endpoints
app.get('/', (req, res) => {
    res.redirect('/index.html')
})
app.use('/demo', demoRedis)
app.use('/posts', postsRouter)


// Listen to server
const PORT = process.env.PORT || 3000
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MONGO DB Connected..!')
        app.listen(PORT, () => console.log(`Server started running on: PORT ${PORT}`))
    })
    .catch(err => {
        console.log('MONGO DB Connection Failure..!')
    })