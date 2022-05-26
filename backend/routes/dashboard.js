const router = require('express').Router()
const auth = require('../middlewares/auth');
const User = require('../model/user');

router.get('/', auth({block: true}), async(req, res) => {
    // const user = await User.findById(res.locals.userId)

    res.status(200).json("user")
    // DONE needs auth midware with block 
    // find user with userID form res.locals.userId
    // return user.dashboards

    // send all dashboards for the user
    
})
/* router.get('/api/dashboards/:id', async(req, res) => {
    // send :id dashboard for the user
})
router.get('/api/dashboards/:id/todos', async(req, res) => {
    // send :id dashboard todos for the user
}) */

router.get('/api/dashboards/:id/todos/:todoId', async(req, res) => {
    // send :todoid dashboard for the user
})
router.post('/api/dashboards', async(req, res) => {
    // create dashboard for the user, send created :id
})
router.post('/api/dashboards/:id/todos', async(req, res) => {
    // create todo in :id dashboard for the user, send created :todoid
})
router.patch('/api/dashboards/:id', async(req, res) => {
    // update dashboard
})
router.patch('/api/dashboards/:id/todos/:todoId', async(req, res) => {
    // update existing :todoId todo in :id dashboard
})
router.delete('/api/dashboards/:id', async(req, res) => {
    // delete dashboard
})
router.delete('/api/dashboards/:id/todos', async(req, res) => {
    // delete dashboard
})

module.exports = router