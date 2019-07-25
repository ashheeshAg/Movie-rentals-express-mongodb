const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const {Movie, validate} = require('../models/movies');
const {Genre}  = require('../models/genre');
router.get('/', (req,res) => {
    const movies = Movie.find();
    movies.then((movies) => {
        res.send(movies);
        console.log('Get API all Movies');
    });
});
router.get('/:id', async (req,res) => {
    const movie = await Movie.findById(req.params.id);
    res.send(movie);
    console.log('Get Api selected movie');
});
router.post('/', async (req,res) => {
    let {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('Invalid Genre Id');
    let movie = new Movie({
        title: req.body.title,
        genre: {
            name: genre.name,
            id: genre._id
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    movie = await movie.save();
    res.send(movie);
    console.log('Post API movie');
});

router.put('/:id', (req,res) => {
    let {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const genre = Genre.findById(req.body.genreId);
    genre.catch((err) => {return res.status(404).send('Invalid Genre Id');});
    let movie  = Movie.findByIdAndUpdate({_id: req.params.id}, {
        $set: {
            title: req.body.title,
            genre: {
                name: genre.name,
                id: genre._id
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }
    }, {new: true});
    movie.then((movie) => {
        res.send(movie);
        console.log('Put Api movie');
    });
});


router.delete('/:id', async (req,res) => {
    let movie = await Movie.findByIdAndRemove(req.params.id);
    res.send(movie);
    console.log('Delete Api movie');
});

module.exports = router;