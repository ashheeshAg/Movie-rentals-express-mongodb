const mongoose = require('mongoose');
const Joi = require('Joi');
const {genreSchema} = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {type: String, required: true,
          minLength: 5, maxLength: 50},
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {type: Number, required: true,
        min: 5, maxLength: 50},
    dailyRentalRate: {type: Number, required: true,
        min: 5, max: 50},
}));
function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(5).required().max(50),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(5).max(50).required(),
        dailyRentalRate: Joi.number().min(5).max(50).required(),
    };
    return Joi.validate(movie, schema);
};
exports.Movie = Movie;
exports.validate = validateMovie;