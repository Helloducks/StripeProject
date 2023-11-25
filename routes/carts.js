var express = require('express');
const multer = require('multer');
const path = require('path');
var router = express.Router();
const Cart =  require('../models/cart');
const stripe = require("stripe")('sk_test_51NVlMOHKR689wiZ5OEMng5a5l8j8ab4kY9lIkHie4src8Iy0Kq7hPErbEsauaOucEfgWhd6RIOAF7tEsod4vQsFc00aPvJtXZz');

router.get('/',(req,res,next)=>{
    Cart.find((err,carts)=>{
        if(err){
            console.log(`Issue with cart Model => ${err}`);
        }else{
            res.render('cart/index',{dataset:carts});
        }
    })
});

router.post('/',(req,res,next)=>{
    Cart.create({
        ItemId: req.body.id,
        name: req.body.name,
        unitPrice: req.body.price,
        quantity: req.body.quantity,
        imagePath: req.body.imagePath
    },(err, newCart) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error processing request");
        } else {
            res.redirect('/cartItems');
        }
    })
});

router.get('/create-stripe-session', (req,res,next)=>{
    
    Cart.find(async (err,cartProducts)=>{
        if(err){
            console.log("error loading the cart "+ err);
        }else{
            try{
        
                console.log('****Inside Post Method*****')
                const session = await stripe.checkout.sessions.create({
                  payment_method_types : ['card'],
                  mode: 'payment',
                  success_url : `http://localhost:3000/carts/success?sessionId={CHECKOUT_SESSION_ID}`,
                  cancel_url : `http://localhost:3000/carts/cancel`,
                  
                  line_items : cartProducts.map(product=>{
                    return{
                        price_data:{
                            currency: 'cad',
                            product_data : {
                                name: product.name
                            },
                            unit_amount : product.unitPrice*100,
                        },
                        quantity: product.quantity  
                    }
                  }

                  )
                });
            
                res.redirect(session.url);
              }catch(e){
                res.status(500).json({error: e.message});
              }

        }
    })
    
    
   
})
router.get('/success',async (req,res,next)=>{

    try {
        const sessionId = req.query.sessionId;
        if (!sessionId) {
            return res.status(400).send("No session ID provided");
        }
    
        await Cart.deleteMany({});
        res.render('cart/success', { title: 'Payment Success',});
        } catch (error) {
        res.status(500).send("Error retrieving session");
        }
    
})
router.get('/cancel',(req,res,next)=>{
    res.render('cart/cancel',{title:"Cancel"});
})


module.exports = router;