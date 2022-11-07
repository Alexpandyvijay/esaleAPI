const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productDetails = new Schema({
    Product_id : { 
        type : String,
        required : true,
        unique : true
    },
    Product_type : String,
    Product_name : String,
    Product_price : Number,
    Available_quantity : Number
})
module.exports = mongoose.model('productdetails',productDetails);