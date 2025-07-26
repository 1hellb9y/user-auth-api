const jwt=require("jsonwebtoken");
const SECRET_KEY=process.env.SECRET_KEY;
const auth=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(400).json({
            msg:"No provided token",
        })
    };
    const token=authHeader.split(" ")[1];
    const decoded=jwt.verify(token,SECRET_KEY);
    req.user=decoded;
    next();
};
module.exports=auth;