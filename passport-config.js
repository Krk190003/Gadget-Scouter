const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt");


 function initialize(passport, getUserByEmail){
    const authenticateUser = async (name, password, done) =>{
        const user = getUserByEmail(name);
        if(user == null){
            return done(null, false, {message: "No User with that username"})
        }
        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }
            else{
               return done(null, false, {message: "Password Incorrect"}) 
            }
        }catch(err){
            return done(err)
        }
    }
    
    passport.use(new LocalStrategy({usernameField: "name", passwordField: "password"  },
    authenticateUser)); 
    passport.serializeUser((user, done) => {done(null, user.id)})
    passport.deserializeUser((id, done) => {
        done(null, getUserById(id));
    })
}

module.exports = initialize;