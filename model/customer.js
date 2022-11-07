const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerDetails = new Schema({
    Customer_id : { 
        type : String,
        required : true,
        unique : true
    },
    Customer_name : String,
    Email : { 
        type : String,
        unique : true,
        required : true
    },
    Balance : Number
})
module.exports = mongoose.model('customerdetails',customerDetails);