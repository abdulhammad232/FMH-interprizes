const mongoose=require('mongoose');
const schema =mongoose.Schema;
const otpSchema= new schema({
    code:
    {
        type:String
    },
    Email:
    {
        type:String
    },
    expireTime:
    {
        type:Number
    }
})
const otp=mongoose.model('otp',otpSchema,'otp')
module.exports=otp
