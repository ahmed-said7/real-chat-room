let handler=require('express-async-handler');

let User=require('../models/userModel');
const apiError = require('../utils/apiError');
let jwt=require('jsonwebtoken');
let bcrypt=require('bcryptjs');

let dotenv = require('dotenv');

dotenv.config({path:"./environ.env"});
console.log(process.env.SECRET_TOKEN);

let login=handler(
    async(req,res,next)=>{
        let {email,password}=req.body;
        let user=await User.findOne({email});
        if(!user){
            return next(new apiError('User not found fot email',400));
        };
        let validPassword=await bcrypt.compare(password,user.password); 
        if(!validPassword){
            return next(new apiError('User or email is not correct',400));
        };
        let token=jwt.sign({userId:user._id},process.env.SECRET_TOKEN,{expiresIn:'2d'});
        res.status(200).json({token , result:"sucess",user});
    }
);

let signup=handler(
    async(req,res,next)=>{
        let user=await User.create(req.body);
        let token=jwt.sign({userId:user._id},process.env.SECRET_TOKEN,{expiresIn:'2d'});
        res.status(200).json({token , result:"sucess",user});
    }
);


let ptotected=handler(
    async(req,res,next)=>{
        let token;
        if(req.headers.authorization){
            token=req.headers.authorization.split(' ')[1];
        };
        if(!token){
            return next(new apiError('no token provided',400));
        };
        let decoded=jwt.verify(token,process.env.SECRET_TOKEN);
        let user=await User.findOne({_id:decoded.userId});
        if(!user){
            return next(new apiError('no user found',400));
        };
        if(user.passwordChangedAt){
            let timeStamps=Math.floor((user.passwordChangedAt/1000));
            if(decoded.iat < timeStamps){
                return next(new apiError('password changed',400));
            };
        };
        req.user = user;
        next();
    }
);

let allowedTo=(...roles)=> handler(
    async(req,res,next)=>{
            if(!roles.includes(req.user.role)){
                return next(new apiError('you are not allowed to access this role',400));
            };
            next();
        })

module.exports={login,signup,allowedTo,ptotected};