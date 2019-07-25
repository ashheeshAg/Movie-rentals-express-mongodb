const mongoose = require('mongoose');
const Joi = require('Joi');
const schema = mongoose.Schema({
    isGold: {type: Boolean , default: false},
    name: {type: String, required: true, maxLength: 50, minLength: 5},
    phone: {type: String, maxLength: 10, minLength: 3, required: true}
});
const Customer = mongoose.model('Customer', schema);
function validateCustomer(customer) {
    const schema = {
        isGold: Joi.boolean().required(),
        name: Joi.string().required(),
        phone: Joi.string().max(10).min(3)
    };
    return Joi.validate(customer, schema);
}
exports.Customer = Customer;
exports.validate = validateCustomer;