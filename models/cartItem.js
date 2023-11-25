const mongoose = require('mongoose');
const cartItemSchemaDefinition = {
    name: {
        type : String,
        required : true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    imagePath : {
        type: String,
        required : true
    }
};

var cartItemSchema = new mongoose.Schema(cartItemSchemaDefinition);

module.exports = mongoose.model('CartItem',cartItemSchema);