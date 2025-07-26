const mongoose=require("mongoose");
async function ConnectToDb(){
    await mongoose.connect("mongodb://localhost:27017/User-authentication-system").then(()=>{console.log("Connected")}).catch((err)=>{console.log(err)});
    console.log("/");
}
module.exports=ConnectToDb;