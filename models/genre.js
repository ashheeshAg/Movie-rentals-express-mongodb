const mongoose = require('mongoose');
const Joi = require('Joi');
const genreSchema = new mongoose.Schema({
    name: {type: String, required: true,
          minLength: 5, maxLength: 50}
});
//We know that we need to write singular name while entering collection name as Parameter
const Genre = mongoose.model('Genre', genreSchema);
function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema);
};
exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;