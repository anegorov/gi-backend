const _ = require('lodash');
const express = require('express');
const router = express.Router();
const {User, validate} = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/', async (req,res) => {
  const {error} = validate(req.body)
  if(error) return res.status(400).send(error);
  
  let user = await User.findOne({email: req.body.email});
  if(user) return res.status(400).send('User already registered');   

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  
  try{
    user = await user.save();
    console.log(user.id);
    const token = jwt.sign({_id: user._id}, config.get('jwtPrivateKey'));
    res
      .header('x-auth-token', token)
      .send(_.pick(user, ['_id','name','email']));
  }
  catch(ex){
    for(field in ex.errors)
      console.log(ex.errors[field]);
  }
 });

 module.exports = router;