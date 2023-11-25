var express = require('express');
const multer = require('multer');
const path = require('path');
var router = express.Router();
const CartItem =  require('../models/cartItem');




// Multer setup
//Multer is also a middleware function and it interspects the 'multipart/form-data' type of request and then add image into the req body
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/',(req,res,next)=>{
    CartItem.find((err,cartItems)=>{
        if(err){
            console.log(err)
        }else{
            const modifiedCart = cartItems.map(item =>{
                item.imagePath = item.imagePath.replace("public\\","")
                return item;
            })

            res.render('cartItems/index',{title: 'Cart', dataset: modifiedCart});
        }
    })
    
});



router.get('/add',(req,res,next)=>{
    res.render('cartItems/add',{title: "Add"});
});



//Here we are adding that multer into the our post request to make it work, 'image' is name of data field from the from where it is suppose to work.
router.post('/add', upload.single('image'), (req, res, next) => {
    // 'image' is the name attribute of your file input in your HTML form
    if (req.file) {
        const imagePath = req.file.path;
        CartItem.create({
            name : req.body.name,
            unitPrice: req.body.price,
            imagePath: imagePath
        }, (err, newCartItem) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error processing request");
            } else {
                res.redirect('/cartItems');
            }
        });
    } else {
        res.status(400).send("No file uploaded");
    }
});

router.get('/item/:_id', async (req,res,next)=>{
    try {
        const id = req.params._id; // Get the ID from the request parameters
        const item = await CartItem.findById(id); // Use findById to fetch the document
        
        if (!item) {
            return res.status(404).send('Item not found');
        }
        item.imagePath = item.imagePath.replace("public\\",'');

        res.render('cartItems/item',{itemObject: item});
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.get('/editList',(req,res,next)=>{
    CartItem.find((err,cartItems)=>{
        if(err){
            console.log(err)
        }else{
            const modifiedCart = cartItems.map(item =>{
                item.imagePath = item.imagePath.replace("public\\","")
                return item;
            })

            res.render('cartItems/editList',{title: 'Edit Items for Admin Use', dataset: modifiedCart});
        }
    })
});

router.get('/delete/:_id',(req,res,next)=>{
    CartItem.remove({ _id: req.params._id }, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('cartItems/editList');
        }
    })
})



module.exports = router;