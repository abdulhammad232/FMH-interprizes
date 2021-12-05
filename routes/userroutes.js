const express=require('express');

//const { authorize } = require('passport');
 const router=express();
 router.set('view-engine','ejs')
 const user=require('../models/usermodel')
 
 // Initalise a new express application
 const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
 router.use(flash())
 router.use(express.json()) // for parsing application/json
 router.use(express.urlencoded({ extended: true }))
  const controller=require('../controller/usercontroller');
  

  router.use(cookieParser('NotSoSecret'));
router.use(session({
  secret : 'something',
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true
}));


router.get('/dashboard',controller.dash)
router.get('/',controller.indexpage)
router.get('/login',controller.login)
router.post('/signup',controller.nameDuplicate,controller.emailDuplicate,controller.store)


 router.post('/login',controller.authenticat)

  


//router.get('/check',controller.authenticate)



 
 
  module.exports=router