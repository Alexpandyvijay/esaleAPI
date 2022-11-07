const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderDetails = new Schema({
    Customer_id : { 
        type : String,
        required : true,
        unique : true
    },
    Product_id : { 
        type : String,
        required : true,
        unique : true
    },
    Product_name : String,
    Quantity : Number
})
module.exports = mongoose.model('orderdetails',orderDetails);