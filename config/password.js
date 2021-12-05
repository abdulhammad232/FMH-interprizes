const passport=require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/usermodel");
module.exports = function(passport) {
passport.use( 'local',
        new LocalStrategy({usernameField : 'username'},(username,password,done)=> {
      User.findOne({username : username})
                .then((response)=>{
               
                 if(!response) {
                 
               
                 
                     return done(null,false,{message : 'that name is not registered'});
                 }
                 //match pass
             
           
                     if(response.password===password) {
               
                      console.log('user mil gayaaaa')
                         return done(null,response);
                        
                     } else {
                    
                        return done(null,false,{message : 'pass incorrect'});
                     }
                 })
             
                .catch((err)=> {console.log(err)})
        })
        
    )
    passport.serializeUser(function(response, done) {
        done(null, response.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, response) {
          done(err, response);
        });
      }); 
}; 