// Require the NPM packages that we need
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const user=require('../models/usermodel')
const Otp=require('../models/otp')
const passport=require('passport')
const nodemailer = require("nodemailer");
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
// const reset=(re,res,next)=>{
//    console.log( re.body)
//      passport.authenticate( 'local',{
//         failureRedirect : '/login',
//         successRedirect : '/resetPassword',
      
//         })(re,res,next);
//   }

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
const reset=(re,res)=>{
   res.render('forget.ejs')
}
const emailSend = async(req, res)=>{
   let data = await user.findOne({email:req.body.email});
   const responseType = {};
   if(data)
   { 
      let otpCode = Math.floor((Math.random()*10000+11));
      let otpData = new Otp({
         email:req.body.email,
         code:otpCode,
         expireTime: new Date().getTime() + 600*1000 //10Minutes
      })
      let otpResponse = await otpData.save();
      responseType.statusText = 'Success';
      responseType.message = 'Please Check your email inbox.';
   }else{
      responseType.statusText = 'Error';
      responseType.message = 'Email id not exist.';
   }
   res.status(200).json(OKAY);
}
const changePassword = async(req, res)=>{
   let data = await Otp.find({email:req.body.email,code:req.body.otpCode});
   const response ={}
   if(data)
   {
      let currentTime = new Date().getTime();
      let difference = data.expireTime - currentTime;
      if(difference < 0){
         Response.message = 'Token Expired!!!'
         Response.statusText('error')
      }else{
         let user = await user.findOne({email:req.body.email});
         user.password = req.body.password;
         user.save();
         Response.message = 'Password Changed successfully.'
         Response.statusText('success')
      }
   }else{
      Response.message = 'Invalid OTP!!!'
      Response.statusText('error')
   }
   req.status(200).json(response);
}

async function main() {
   // Generate test SMTP service account from ethereal.email
   // Only needed if you don't have a real mail account for testing
   let testAccount = await nodemailer.createTestAccount();
 
   // create reusable transporter object using the default SMTP transport
   let transporter = nodemailer.createTransport({
     host: "smtp.ethereal.email",
     port: 587,
     secure: false, // true for 465, false for other ports
     auth: {
       user: testAccount.user, // generated ethereal user
       pass: testAccount.pass, // generated ethereal password
     },
   });
 
   // send mail with defined transport object
   let info = await transporter.sendMail({
     from: 'abdulhammad320@gmail.com', // sender address
     to: "hammadansari456456@gmail.com, baz@example.com", // list of receivers
     subject: "Hello ✔", // Subject line
     text: "Hello world?", // plain text body
     html: "<b>Hello world?</b>", // html body
   });
 
   console.log("Message sent: %s", info.messageId);
   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
 
   // Preview only available when sending through an Ethereal account
   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
 }
 
 main().catch(console.error);

module.exports = { store,nameDuplicate,indexpage,emailDuplicate,login,authenticat,dash,emailSend,changePassword,reset}
