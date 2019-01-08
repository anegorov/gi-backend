const express = require('express');
const app = express();
const Joi = require('joi');

const mongoose = require('mongoose');

mongoose.connect('mongodb://giuser:giuser1234@ds024748.mlab.com:24748/guidein', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const productSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: {type: Date, default: Date.now},
    isPublished: Boolean
});

const Product = mongoose.model('Products', courseSchema);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const docs = [
    {id:1, name:'doc1'},
    {id:2, name:'doc2'},
    {id:3, name:'doc3'}
]

async function createProduct(){
  const product = new Product({
      name: 'Angular Course',
      author: 'Mosh',
      tags: ['angular','frontend'],
      isPublished: true
  });
  
  const result = await product.save();
  console.log(result);
}

async function getProduct(){
  const products = await Product
      .find({author:'Mosh', isPublished:true})
      .limit(10)
      .sort({name: 1})
      .select({name:1, tags:1});
  console.log(products);
}

app.get('/',(req,res) => {
   res.send('App developed by Andrey Egorov.');
});

app.get('/api/docs',(req,res) => {
   res.send(docs);
});

app.get('/api/docs/:id',(req,res) => {
  const doc = docs.find(c => c.id === parseInt(req.params.id));
  if(!doc) res.status(404).send('The document with the given id wasnt found');
   res.send(doc);
});

app.get('/api/create',(req,res) => {
  createProduct().then(
    (res) => res.send(res)
  );
});

app.get('/api/get',(req,res) => {
  getProduct().then(
    (res) => res.send(res)
  );
});


const server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log(`Express is working on port ${port}...`);
});
