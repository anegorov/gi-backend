const express = require('express');
const app = express();
const Joi = require('joi');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const docs = [
    {id:1, name:'doc1'},
    {id:2, name:'doc2'},
    {id:3, name:'doc3'}
]

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

app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;
  console.log(`Express is working on port ${port}...`);
});