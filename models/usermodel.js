const mongoose=require('mongoose');
const schema =mongoose.Schema;
const userShema= new schema({
    username:{
    type:String
},
Email:{
type:String
},
password:{
    type:String
    }
})
const user=mongoose.model('user',userShema)
module.exports=user
