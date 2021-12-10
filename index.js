const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const app = express()
const passport=require('passport')
app.use(passport.initialize())
// const flash = require('connect-flash')
// app.use(flash())
// app.set('view-engine', 'ejs')
const userroutes=require('./routes/userroutes')
mongoose.connect(`mongodb://localhost:27017/TestDB`, {
  useNewUrlParser: true,
	useUnifiedTopology: true
});
const db = mongoose.connection;

db.once('open', () => {
	console.log("Connected to MongoDB database...");
});
const port = 3000



app.use(express.json())
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
app.use(userroutes)
