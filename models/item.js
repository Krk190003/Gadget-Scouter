const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const itemSchema = new Schema({
    ProductName: {type: String, required: true},
    imgUrl: {type: String, required: true},
    Links: {type: Object, required: true},
    Prices: {type: Object, required: true}

}, );


const Item = mongoose.model('Item', itemSchema)

module.exports = Item;