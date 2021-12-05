// Require the NPM packages that we need
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const user=require('../models/usermodel')
const passport=require('passport')
require("../config/password")(passport)
// Initalise a new express application
const app = express();

app.use(passport.session())
// Set a default environment port or cutom port - 5000
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// Set Cookie Parser, sessions and flash
app.use(cookieParser('NotSoSecret'));
app.use(session({
  secret : 'something',
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true
}));
app.set('view engine','ejs');
app.use(passport.initialize())
 
app.use(flash());
const indexpage= (req, res)=> {
     
   const message = req.flash('user');
   res.render('signup.ejs', { message:req.flash('message') } )
 }
 const nameDuplicate=(re,res,next)=>
{
   user.findOne({"username":re.body.username}).then(response=>{
      if(response)
        {
          m='UserName Already exist kindly try another one!'
     
           error=1
         re.flash('message',m)
        res.redirect('/')
     
       
   }else{
      return next()
   }
   })
   
}
const authenticat=(re,res,next)=>{
 console.log( re.body)
   passport.authenticate( 'local',{
      failureRedirect : '/login',
      successRedirect : '/dashboard',
    
      })(re,res,next);
}

   const emailDuplicate =(re,res,next)=>
{console.log('elllooooooooooooo')
   user.findOne({"Email":re.body.Email}).then (response=>{
      if(response)
{  
        console.log(response)   
       m='WE Already have an account associated with this email!'
     
       re.flash('message',m)
     res.redirect('/')
    
     }
     else
     {
     return next()
     }
    })
  
}
      //
  
   

const  store  =(req, res) => 
{

   const u = new user({
      username: req.body.username,
      Email: req.body.Email,
      password: req.body.password,


   })
  
   

   u.save().then(() => {
     req.flash('message',"data submitted")
    m='Data saved!'
    res.redirect('/')


   }
  
   )
}
const login=(re,res)=>{
   res.render('login.ejs', { error:re.flash('error') })
}
const dash=(re,res)=>{

   res.render('dashboard.ejs')
}
module.exports = { store,nameDuplicate,indexpage,emailDuplicate,login,authenticat,dash}
   