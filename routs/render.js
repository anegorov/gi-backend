const {Product, validate} = require('../models/product');
const express = require('express');
const router = express.Router();

router.post('/create', async (req,res) => {
  
  const {error} = validate(req.body)
  if(error) return res.status(400).send(error);
  
  let product = new Product(req.body);
      
  try{
    product = await product.save();
    console.log(product.id);
    res.send(product.id);
  }
  catch(ex){
    for(field in ex.errors)
      console.log(ex.errors[field]);
  }  
});
  
router.get('/products', async (req,res) => {
    const products = await Product
        .find().sort('sname');
    console.log(products);
    res.send(products);
});
  
router.get('/product/:id', async (req,res) => {
  const product = await Product
    .findById(req.params.id);

  if(!product) return res.status(400).send(`There is no product with id [${req.params.id}]`);

  console.log(product);
  res.send(product)
});

router.get('/product/link/:link', async (req,res) => {
  const product = await Product
    .findOne({link: req.params.link});

  if(!product) return res.status(400).send(`There is no product with link [${req.params.id}]`);

  console.log(product);
  res.send(product)
});
  
router.put('/product/:id', async (req,res) => {
  const {error} = validate(req.body)
  if(error) return res.status(400).send(error);
  
  const product = await Product
    .findByIdAndUpdate(req.params.id, {sname: req.body.sname}, {new: true})

  if(!product) return res.status(400).send(`There is no product with id [${req.params.id}]`);

  res.send(product)
});
  
router.delete('/product/:id', async (req,res) => { 
  const product = await Product
    .findByIdAndRemove(req.params.id)

  if(!product) return res.status(400).send(`There is no product with id [${req.params.id}]`);

  res.send(product.id)
});
  
module.exports = router;