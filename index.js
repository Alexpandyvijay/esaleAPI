const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const orderDetails = require('./model/order.js');
const productDetails = require('./model/product.js');
const customerDetails = require('./model/customer.js');

app.set("views", path.join(__dirname,'/views'));
app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json());


app.get('/',async (req,res)=>{
    let product_info = await productDetails.find({});
    let customer_info = await customerDetails.find({});
    let order_info = await orderDetails.find({});
    let data = {
        productInfo : product_info,
        customerInfo : customer_info,
        orderInfo : order_info
    }
    res.render('productinfo',{data : data});
})

app.post('/orders',async (req,res)=>{
    const newOrder = {...req.body};
    let Product_info = await productDetails.findOne({Product_id : newOrder.Product_id});
    if(newOrder.Quantity > Product_info.Available_quantity){
        res.json({
            status : 'failed',
            message : 'ITEM IS OUT OF STOCK'
        })
    }else{
        let Customer_info = await customerDetails.findOne({Customer_id : newOrder.Customer_id});
        if(Product_info.Product_price*newOrder.Quantity > Customer_info.Balance){
            res.json({
                status : 'failed',
                message : 'INSUFFICIENT FUNDS'
            })
        }else{
            let newBalance = Customer_info.Balance - Product_info.Product_price*newOrder.Quantity;
            let newAvailable_quantity = Product_info.Available_quantity - newOrder.Quantity;
            await customerDetails.findOneAndUpdate({Customer_id : newOrder.Customer_id},{Balance : newBalance});
            await productDetails.findOneAndUpdate({Product_id : newOrder.Product_id},{Available_quantity : newAvailable_quantity});
            orderDetails.create(newOrder,(err,docs)=>{
                if(err){
                    res.json({
                        status : 'failed',
                        message : err
                    })
                }else{
                    res.json({
                        status : 'success',
                        message : 'Order placed successfully..'
                    })
                }
            })
        }
    }
})

app.post('/product',(req,res)=>{
    const newProduct = {...req.body};
    productDetails.create(newProduct,(err,docs)=>{
        if(err){
            res.json({
                status : 'failed',
                message : err
            })
        }else{
            res.json({
                status : 'success',
                message : 'produced details updated successfully'
            })
        }
    })
})

app.post('/customer',(req,res)=>{
    const newCustomer = {...req.body};
    customerDetails.create(newCustomer,(err,docs)=>{
        if(err){
            res.json({
                status : 'failed',
                message : err
            })
        }else{
            res.json({
                status : 'success',
                message : 'registered successfully '
            })
        }
    })
})
app.get('/orders/:orderId',async (req,res)=>{
    let orderId = req.params.orderId;
    let order_info = await orderDetails.findOne({_id : orderId});
    if(!order_info){
        res.json({
            status : 'failed',
            message : 'Invalid orderId'
        })
    }else{
        res.json({
            status : 'success',
            data : order_info
        })
    }
})
app.get('/product/:productId',async (req,res)=>{
    let productId = req.params.productId;
    let product_info = await productDetails.findOne({Product_id : productId});
    if(!product_info){
        res.json({
            status : 'failed',
            message : 'Invalid Product id'
        })
    }else{
        res.json({
            status : 'success',
            data : product_info
        })
    }
})

app.get('/customer/:customerId',async (req,res)=>{
    let customerId = req.params.customerId;
    let customer_info = await customerDetails.findOne({Product_id : customerId});
    if(!customer_info){
        res.json({
            status : 'failed',
            message : 'Invalid customer id'
        })
    }else{
        res.json({
            status : 'success',
            data : customer_info
        })
    }
})

app.put('/:productName/:availableQuantity', (req,res)=>{
    let productName = req.params.productName;
    let availableQuantity = req.params.availableQuantity;
    productDetails.findOneAndUpdate({Product_name : productName},{Available_quantity : availableQuantity},(err,docs)=>{
        if(err){
            res.json({
                status : 'failed',
                message : err
            })
        }else{
            res.json({
                status : 'success',
                message : 'quantity updated successfully'
            })
        }
    })

})

app.put('/:emailId/:costOfAnOrder',async (req,res)=>{
    let {emailId , costOfAnOrder} = req.params;
    let customer_Info = await customerDetails.findOne({Email : emailId});
    let updatedBalance  = parseInt(customer_Info.Balance) - parseInt(costOfAnOrder);
    customerDetails.findOneAndUpdate({Email : emailId},{Balance : updatedBalance},(err,docs)=>{
        if(err){
            res.json({
                status : 'failed',
                message : err
            })
        }else{
            res.json({
                status : 'success',
                message : 'balance updated successfully'
            })
        }
    })
})

mongoose.connect(process.env.MONGO_URL,()=>(console.log('database connected successfully..')));
app.listen(process.env.PORT,()=>(console.log(`port running on ${process.env.PORT}`)));

