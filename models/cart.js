const mongoose = require('mongoose');
const cartSchemaDefinition = {
    ItemId: {
        type: String,
        required: true
    },
    name: {
        type : String,
        required : true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    imagePath : {
        type: String,
        required : true
    }
};

var cartSchema = new mongoose.Schema(cartSchemaDefinition);

module.exports = mongoose.model('Cart',cartSchema);