const Joi = require('joi');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sname: {
      type: String, 
      required: true,
      minlength: 5
    },
    lname: String,
    image: String,
    description: String,
    dtime: String,
    level: String,
    link: {type:String,required: true},
    material: String,
    pdfurl: String,
    tags: [String],
    images: [String],
    type: {
      type: String,
      enum: ['игрушка','мебель','спорт','досуг'],
      required: true,
      lowercase: true,
      trum: true
    },
    date: {type: Date, default: Date.now},
    isPublished: Boolean
});

const Product = mongoose.model('Products', productSchema);

function validateProduct(product){
    const schema = {
        sname: Joi.string().min(3).required(),
        lname: Joi.string().min(3).required(),
        image: Joi.string().min(3).required(),
        description: Joi.string(),
        dtime: Joi.string(),
        level: Joi.string(),
        link: Joi.string(),
        material: Joi.string(),
        pdfurl: Joi.string(),
        tags: Joi.array().items(Joi.string()),
        images: Joi.array().items(Joi.string()),
        type: Joi.string(),
        isPublished: Joi.boolean()
      };
    
    return Joi.validate(product, schema);
}

exports.Product = Product;
exports.validate = validateProduct;