//4 Main sites we are going to use 
//1. Best Buy 
//2. MicroCenter
//3. Amazon
//4. Newegg 


const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const mongoose_config = {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
const Item = require("./models/item.js");
let PageTest;




let browser;








    




const launchBrowser = async () => {
    
 browser = await puppeteer.launch({
        headless:true,
        defaultViewport: null,
        args: [
            "--incognito",
            "--no-sandbox",
            "--single-process",
            "--no-zygote"
        ],
        
    });
   
    const page = await browser.newPage(); 
    
    

    return page;
    
    
}

const fetchPrices = async (retailer,) => {
    const page = await launchBrowser();
    page.setJavaScriptEnabled(false)
    page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36");


   
       items = await Item.find({}, (err) => {if(err) {console.log(err)}}); 

        if(retailer == "BestBuy"){
            for(let i =0; i<items.length; i++){
            
                await page.goto(items[i].Links.Bestbuy)
            const grabPrice = await page.evaluate(() => {
                let price = document.querySelector('.priceView-hero-price span');
                if(!price){
                    price = document.querySelector('.pricing-price.pricing-lib-price-8-2130-4.priceView-price div.priceView-hero-price span');
                }
                return price.innerText;
            });
            await Item.findOneAndUpdate({"ProductName": items[i].ProductName,}, {"Prices.BestBuy" : grabPrice}, mongoose_config);
            console.log(grabPrice);
            }
        }
        else if(retailer == "Amazon"){
            for(let i =0; i<items.length; i++){
            
            await page.goto(items[i].Links.Amazon);
            let grabPrice = await page.evaluate(() => {
             
                const price = document.querySelector('#priceblock_ourprice');
                return price.innerText;
            });
            await Item.findOneAndUpdate({"ProductName": items[i].ProductName,}, {"Prices.Amazon" : grabPrice}, mongoose_config);
            console.log(grabPrice);
        }

        }
        else if(retailer == "MicroCenter"){
            for(let i =0; i<items.length; i++){
            
            await page.goto(items[i].Links.MicroCenter);
            let grabPrice = await page.evaluate(() => {
                const price = document.querySelector('#pricing');
                return price.innerText;
            });
            await Item.findOneAndUpdate({"ProductName": items[i].ProductName,}, {"Prices.MicroCenter" : grabPrice}, mongoose_config);
            console.log(grabPrice);
        }

        }

        else if(retailer == "Newegg"){
            for(let i =0; i<items.length; i++){
            
            await page.goto(items[i].Links.Newegg);
            let grabPrice = await page.evaluate(() => {
                const price = document.querySelector('.price-current');
                return price.innerText;
            });
            await Item.findOneAndUpdate({"ProductName": items[i].ProductName,}, {"Prices.Newegg" : grabPrice}, mongoose_config);
            console.log(grabPrice);
        }

        }

      
    
    await browser.close();



    return page;
}

const test = async () => {
    const page = await launchBrowser();
    page.setJavaScriptEnabled(false)
    page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36");
    await page.goto("https://www.newegg.com/apple-ipad-pro-gray/p/24W-0002-00MN4?Description=Ipad%20Pro&cm_re=Ipad_Pro-_-24W-0002-00MN4-_-Product&quicklink=true")
    let pagehtml = await page.evaluate(() => {
        const price = document.querySelector('html');
        return price.innerHTML;
    });
    
    return pagehtml;


}




const runScraper = async () => {
    await fetchPrices("BestBuy");
console.log("-------");
await fetchPrices("Amazon");
console.log("-------");
await fetchPrices("MicroCenter");
console.log("-------");
await fetchPrices("Newegg");
console.log("-------");
console.log("-------");



return;
}










module.exports ={PageTest,test};




