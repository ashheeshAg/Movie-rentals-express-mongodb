const express= require('express');
const router = express.Router();
const Joi = require('Joi');
const mongoose = require('mongoose');
const {Customer , validate} = require('../models/customer');
router.get('/', (req,res) => {
    const customerPromise = Customer.find().then((result) => {
        res.send(result);
        console.log('Get Request for Customers API');
    });
});
router.get('/:id', (req,res) => {
    const customer = Customer.findById(req.params.id);
    customer.catch((err) => {return res.status(404).send('Customer for given id not found');});
    customer.then((customer) => {
        res.send(customer);
        console.log('Specific Customer Get API');
    });  
});
router.post('/', async (req,res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });
    customer = await customer.save();
    res.send(customer);
    console.log('Post Request for Customers API');
});
router.put('/:id', (req,res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const customer = Customer.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        }
    }, {new: true});
    if(!customer) return res.status(404).send('Customer for given id not found');
    customer.then((customer) => {
        res.send(customer);
        console.log('Customer Updated');
    });
});
router.delete('/:id', async (req,res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if(!customer) {
        return res.status(404).send('Customer for given id not found');
    }
    res.send(customer);
    console.log('Customer Deleted');
});

router.get('/record', async (req,res) => {
    const record = Customer.find();
    if(!record) return res.status(404).send('Customers not found');
    res.send(record);
})
module.exports = router;