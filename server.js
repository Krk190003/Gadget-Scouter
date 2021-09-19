require("dotenv").config();
const express= require("express"); 
const app = express();
// const dbURI = process.env.MONGODBURI;
const dbURI = "mongodb+srv://Main-User:Appar1212@shopper-tracker.w3qt4.mongodb.net/Shopper-Tracker?retryWrites=true&w=majority" 
const mongoose = require("mongoose");
const User = require('./models/user')
const bcrypt = require("bcrypt");
const session = require("express-session"); 
const mongodbSession = require("connect-mongodb-session")(session);
const cors = require("cors"); 
const Item = require("./models/item.js");
const ProductScraper = require("./productScrapper");



// heroku config:set MONGODB_URI='mongodb+srv://Kokil:Appar1212@shopper-tracker.w3qt4.mongodb.net/Shopper-Tracker?retryWrites=true&w=majority'


//Connect to Database 


mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true }).then(result => {
    console.log("Connected to DB")
    

}).catch((e) => console.log(e))

app.listen(process.env.PORT || 5000);
//Route Middleware

const Mongostore = new mongodbSession({
    uri: dbURI,
    collection: "sessions",

})

const isAuth = (req, res, next) => {
    if(req.session.isAuth){
        console.log(req.session.isAuth)
        next()
    }
    else{
        console.log(req.session.isAuth)
       next()
    }
}



//Global Middleware 
app.use(cors({
    origin:"http://localhost:3000",
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(session({
    secret: "randomKey",
    resave: false,
    saveUninitialized: false, 
    store: Mongostore,
    unset:"destroy",
    cookie: {
        secure:false,
        maxAge: 1000*60*10,
        httpOnly: true,


    },
    
   
}))







//Base routes

app.get("/", (req, res) => {
    res.redirect("/login");
})




app.post("/login", async (req, res) => {

    let MatchedProfile = await User.findOne({userName: req.body.Username}).exec();
    
    
    if(!MatchedProfile){
        console.log("No account Exists with that Username");
        res.status(401).json({status: 401, msg:"Failed to Login"}).end();
    } 
    else {
        let correctPassword = await bcrypt.compare(req.body.Password, MatchedProfile.password)
        if(correctPassword){
            req.session.isAuth = true;
            console.log(req.session);
            console.log(`Cookie Expires on ${req.session.cookie.expires}`)
            console.log("Account Found");
            res.status(200).json({status: 200, msg: "Successfully Logged in"})
            

        }
        else{
            res.status(401).json({status: 401, msg:"Failed to Login"}).end();
        }
          
     
        
    }
    
    
  
})


app.delete("/logout", async (req, res) => {
    req.session.destroy() 
    res.end();

   
})


//Signup Routes 
app.get("/Sign-In", (req, res) => {
    
    res.sendFile(__dirname + "/views/RegisterPage.html");
})

app.post("/Sign-In", async (req, res, next) => {
    let isEmailUsed = await User.findOne({email: req.body.Email}).exec();
    let isUserNameUsed = await User.findOne({userName: req.body.Username}).exec();

    if(isEmailUsed || isUserNameUsed){
        if(isEmailUsed){
            res.status(409).json({status: 409, msg: "Email is already assoicated with another account"});
        }
        else if(isUserNameUsed){
            res.status(409).json({status: 409, msg: "Username already in use"});
        }
    }
    else{
        const hashedPassword = await bcrypt.hash(req.body.Password, 10)

    const user = new User({
        email: req.body.Email,
        userName: req.body.Username,
        password: hashedPassword,
     });
     
     try{
        result = await user.save()
        console.log(result);
        //res.redirect("/login");
        res.status(200).json({status: 200, msg: "Successfully Registered User"});
        
     }
     catch(err){
         console.log(`Error Registring User ${err}`); 
         //res.redirect("/Sign-Up");
         res.status(500).json({status: 500, msg: "Failed to Register User"});
     }
    }
    
    
     
})

//Authorization Route 

app.get("/Authorize",  (req, res) => {
    if(req.session.isAuth){
        res.send(true);
    }
    else{
        res.send(false);
    }
})

// Search-Route 

app.get("/product", async (req, res) => {
    let name = req.query.name; 

    let product; 

       product = await Item.findOne({ProductName: `${name}`}, (err) => {if(err) {console.log(err)}}); 
       
       res.json(product)

   

 
    

})

app.get("/search", async (req, res) => {
    let term = req.query.term; 
    let filteredDataList; 
  

    if(term == "undefined"){
        console.log("fasfdsf")
        filteredDataList = await Item.find({}, (err) => {if(err) {console.log(err)}}); 
    }
    else{
          const regex = new RegExp(`${term}`, "i")
        filteredDataList = await Item.find({"ProductName": regex}, (err) => {if(err) {console.log(err)}}); 
    }
    res.json(filteredDataList)
}
    
       
)      

   
app.get("/test", async (req, res)=> {
    let t = await ProductScraper.test();
   res.send(t);

    // res.send(ProductScraper.PageTest);
})

 
    


//Commands Run on Server Startup 



// ProductScraper.runScraper().then(()=> {
//     console.log("Done");
// })

