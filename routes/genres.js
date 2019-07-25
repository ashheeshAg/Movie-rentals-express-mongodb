const express = require('express');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const asyncMiddleware = require('../middlewares/async');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const {Genre, validate} = require('../models/genre');

router.get('/', asyncMiddleware(async (req, res) => {
    throw new Error('Could not get genres'); 
    const genres = await Genre.find();
    res.send(genres);
}));

router.post('/', auth, asyncMiddleware(async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    //id: genres.length + 1,
    name: req.body.name
  });
  genre = await genre.save();
  //genres.push(genre);
  res.send(genre);
}));

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  //const genre = genres.find(c => c.id === parseInt(req.params.id));
  const genre = await Genre.findByIdAndUpdate(req.params.id, {
    $set: {
      name: req.body.name
    }
  });
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  
  // genre.name = req.body.name; 
  res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  //const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  //const index = genres.indexOf(genre);
  //genres.splice(index, 1);

  res.send(genre);
});

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  //const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

module.exports = router;