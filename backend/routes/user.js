const router = require('express').Router()

router.post('/api/login', async(req, res) => {
    // recieve google code -> get google token -> get userID
    // googleId exists ? send jwt token : create user 
})