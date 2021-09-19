const mongoose = require("mongoose");
const itemDB = require("./models/item.js");
const ProductList = require("./productList")

require("dotenv").config();






const db = mongoose.connect(process.env.MONGODBURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(result => {
    console.log("Connected to DB")
}).catch(() => console.log("Failed to connect to DB"))




const initalizePDB = async () => {
    // for (product in productList) {
    //     const productListing = new itemDB({
    //         ProductName: productList[product].ProductName,
    //         imgUrl: productList[product].imgUrl,
    //         ProductUrls: productList[product].Links,
    //         ProductPrices: productList[product].Prices, 

    //     })
    //     await productListing.save();
    // }

    await itemDB.create(ProductList.productList);

}


initalizePDB().then(() => {
    console.log("Data Registered");
})