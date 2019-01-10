const express = require('express');
const app = express();
const Joi = require('joi');

const mongoose = require('mongoose');

mongoose.connect('mongodb://giuser:giuser1234@ds024748.mlab.com:24748/guidein', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const productSchema = new mongoose.Schema({
    sname: String,
    lname: String,
    image: String,
    description: String,
    dtime: String,
    level: String,
    link: String,
    material: String,
    pdfurl: String,
    tags: [String],
    images: [String],
    type: String,
    date: {type: Date, default: Date.now},
    isPublished: Boolean
});

const Product = mongoose.model('Products', productSchema);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const docs = [
    {id:1, name:'doc1'},
    {id:2, name:'doc2'},
    {id:3, name:'doc3'}
]

async function createProduct(objProduct){
  const product = new Product(objProduct);
  
  const result = await product.save();
  console.log(result);
  return result;
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

app.post('/api/create',(req,res) => {
  const schema = {
    sname: Joi.string().min(3).required()
  };

  const result = Joi.validate(req.body, schema);
  if(result.error){
    res.status(400).send(result.error);
    return;
  }

  createProduct(req.body).then(
    (result) => res.send(result)
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
