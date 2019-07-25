const _  = require('lodash');
const Joi = require('Joi');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const {User} = require('../models/user');

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findOne({ email: req.body.email });
    // We do not send 404 as we do not want to tell client what is the reason
    if (!user) return res.status(400).send('Invalid email or Password..');
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or Password..');
    // Here we need to create a new json web token before sending a response
    const token = user.generateAuthToken();
    res.send(token);
});
function validateUser(user) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
      };
    
      return Joi.validate(user, schema);
}
module.exports = router;