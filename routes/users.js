const config = require('config');
const jwt= require('jsonwebtoken');
const auth = require('../middlewares/auth');
const _  = require('lodash');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const {User, validate} = require('../models/user');

router.get('/me', auth, (req,res) => {
    const userPromise = User.findById(req.user._id).select('-password'); 
    userPromise.then((user) => {
        res.send(user);
    });
})
router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt= await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user = await user.save();
    /* When user registers we want him/her to get automatically logged in so
    also need to generate a jwt token, now we cannot send it in response body, so we'll
    send it by setting custom header for response */
    const token = user.generateAuthToken(); 
    res.header('x-auth-token', token).send(_.pick(user, ['name', 'email', '_id']));
});

module.exports = router;