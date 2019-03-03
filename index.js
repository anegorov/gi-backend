const express = require('express');
const app = express();
const render = require('./routs/render');
const users = require('./routs/users');
const auth = require('./routs/auth');
const path = require('path');
const mongoose = require('mongoose');
const {Product, validate} = require('./models/product');
const cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: 'dx8upsrgu', 
  api_key: '468918147237958', 
  api_secret: 'LcXS1GTR_vHusbTXAIliLX1N5gk' 
});

mongoose.connect('mongodb://giuser:giuser1234@ds024748.mlab.com:24748/guidein', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/render', render);
app.use('/api/users', users);
app.use('/api/auth', auth);

function getImageUrl(imageName){
  return cloudinary.image(imageName, { alt: "Image num one" });
}

app.get('/',(req,res) => {
   res.send('Img=' + getImageUrl("bed-gulliver/sborka1.jpg")); 
});

var cb1 = async function (req, res, next) {
  const product = await Product
  .find({link: req.params.link})
  .select({images: 1});

  if(!product) res.status(400).send(`There is no page with link [${req.params.id}]`); 

  console.log('H:'+product.images);
  next();
}

app.get('/render/:link', async function (req, res) {

  const product = await Product
    .find({link: req.params.link});

    let imagesList = product[0].images.reduce((accamulator, currVal) => {
      return accamulator + getImageUrl(currVal);
    },0);
    imagesList = imagesList.substr(1,imagesList.lenght);

    let html = `
    <!DOCTYPE html>
    <html>
      <head><title>${product[0].sname}</title></head>
      <body>
        <h2>${product[0].lname}</h2>
        <div>
          ${imagesList}
          <p>${product[0].description}</p>
        </div>
      </body>
    </html>`;
    
    console.log(html);

    res.send(html);
    
});

const server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log(`Express is working on port ${port}...`);
});
