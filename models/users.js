const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    username:{
        type:String,
        required:[true,'Username is required']
    },
    password:{
        type:String,
        required:[true,'Password is required']
    }
})

userSchema.pre('save',async function(next){
    this.password= await bcrypt.hash(this.password,12);
    next();
})

userSchema.statics.findAndValidate=async function(username,password){
    const foundUser=await this.findOne({username});//or username:username
    if(!foundUser)
    return false;
    const isValid=await bcrypt.compare(password,foundUser.password);
    return isValid?foundUser:false;
}
module.exports=mongoose.model("User",userSchema);

//NOTE-> No need to exports all things associateds with mode lie -(1.)Pre and Post Middleware
//(2). Schema.ststics