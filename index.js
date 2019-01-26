const express = require('express');
const app = express();
const render = require('./routs/render');
const pug = require('pug');
const path = require('path');
const mongoose = require('mongoose');
const {Product, validate} = require('./models/product');

mongoose.connect('mongodb://giuser:giuser1234@ds024748.mlab.com:24748/guidein', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/render', render);

const texts = [
  { title: 'Hey1', message: 'Hello there!1' },
  { title: 'Hey2', message: 'Hello there!2' },
  { title: 'Hey3', message: 'Hello there!3' }
]

app.get('/',(req,res) => {
   res.send('App developed by Andrey Egorov.');
});

app.get('/render/:link', async function (req, res) {

  const product = await Product
    .find({link: req.params.link});

  console.log(product);

  if(!product) res.status(400).send(`There is no page with link [${req.params.id}]`); 
  
  res.render('index', { page: product});
});

const server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log(`Express is working on port ${port}...`);
});
