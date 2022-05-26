const router = require('express').Router()

router.post('/api/login', async(req, res) => {
    // recieve google code -> get google token -> get userID
    // googleId exists ? send jwt token : create user 
    res.sendStatus(418)
})

router.get('/', async(req, res) => {
    // try
    res.status(418).json("hi👋")
})

module.exports = router