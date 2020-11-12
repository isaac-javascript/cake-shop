const createError = require('http-errors');
const express = require('express');
const Joi = require('joi');

/**
 * Cake validation schema.
 * @type {Joi.ObjectSchema<any>}
 */
const cakeSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  flavors: Joi.array().items(Joi.string())
});
/** Stores cakes. */
let cakes = [];
const router = express.Router();

/**
 * Finds cake by its name.
 * @param {string} cakeName
 * @return {Object}
 */
function findCake(cakeName) {
  return cakes.find(({name}) => name === cakeName);
}

/**
 * Finds cake index by its name.
 * @param {string} cakeName
 * @return {number}
 */
function findCakeIndex(cakeName) {
  return cakes.findIndex(({name}) => name === cakeName);
}

router.get('/', (req, res) => {
  res.status(200).json(cakes);
});

router.post('/', (req, res, next) => {
  const {name, price, flavors} = req.body;
  const {err} = cakeSchema.validate({name, price, flavors});
  if(err) {
    next(createError(404, 'Invalid parameter'));
    return;
  }
  cakes.push({
    name,
    price,
    flavors
  });
  res.status(201).send();
});

router.get('/:cakeName', (req, res, next) => {
  const {cakeName} = req.params;
  const cake = findCake(cakeName);
  if(!cake) {
    next(createError(404, `cake not found: ${cakeName}`));
    return;
  }
  res.status(200).json(cake);
});

router.put('/:cakeName', (req, res, next) => {
  const {cakeName} = req.params;
  const {price, flavors} = req.body;
  const {err} = cakeSchema.validate({name: cakeName, price, flavors});
  if(err) {
    next(createError(404, 'Invalid parameter'));
    return;
  }
  const cakeIndex = findCakeIndex(cakeName);
  if(cakeName === -1) {
    next(createError(404, `cake not found: ${cakeName}`));
    return;
  }
  const cake = cakes[cakeIndex];
  cakes[cakeIndex] = {...cake, price, flavors};
  res.status(201).send();
});

router.delete('/:cakeName', (req, res, next) => {
  const {cakeName} = req.params;
  const cakeIndex = findCakeIndex(cakeName);
  if(cakeIndex === -1) {
    next(createError(404, `cake not found: ${cakeName}`));
    return;
  }
  cakes.splice(cakeIndex, 1);
  res.status(202).send();
});

module.exports = router;
