const {Product, validate} = require('./models/product');
const express = require('express');
const app = express();

const mongoose = require('mongoose');

mongoose.connect('mongodb://giuser:giuser1234@ds024748.mlab.com:24748/guidein', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res) => {
   res.send('App developed by Andrey Egorov.');
});

app.post('/api/create', async (req,res) => {
  
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

app.get('/api/products', async (req,res) => {
    const products = await Product
        .find().sort('sname');
    console.log(products);
    res.send(products)
});

app.get('/api/product/:id', async (req,res) => {
  const product = await Product
    .findById(req.params.id);

  if(!product) return res.status(400).send(`There is no product with id [${req.params.id}]`);

  console.log(product);
  res.send(product)
});

app.put('/api/product/:id', async (req,res) => {
  const {error} = validate(req.body)
  if(error) return res.status(400).send(error);
  
  const product = await Product
    .findByIdAndUpdate(req.params.id, {sname: req.body.sname}, {new: true})

  if(!product) return res.status(400).send(`There is no product with id [${req.params.id}]`);

  res.send(product)
});

app.delete('/api/product/:id', async (req,res) => { 
  const product = await Product
    .findByIdAndRemove(req.params.id)

  if(!product) return res.status(400).send(`There is no product with id [${req.params.id}]`);

  res.send(product.id)
});

const server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log(`Express is working on port ${port}...`);
});
