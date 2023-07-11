let handler=require('express-async-handler');
let User=require('../models/userModel');
const apiError = require('../utils/apiError');
let bcrybt=require('bcryptjs');
let transport=require('../utils/sendEmail');
let jwt=require('jsonwebtoken');
const { response } = require('express');
let dotenv=require('dotenv');
dotenv.config({path:"./environ.env"});
let sharp=require('sharp');
let uuid=require('uuid');



let resizeImage=handler(
    async(req,res,next)=>{
        if(req.files){
            if(req.files.Images){
                req.body.Images=[];
                let mapArray=req.files.Images.map(async(img)=>{
                    let filename=`user-${uuid.v4()}-${Date.now()}.jpeg`;
                    await sharp(img.buffer).resize(400,400).
                    toFormat('jpeg').jpeg({quality:90}).toFile(`uploads/users/${filename}`);
                    console.log(filename);
                    req.body.Images.push(filename);
                });
                await Promise.all(mapArray);
            };
            if(req.files.profileImage){
                let filename=`user-${uuid.v4()}-${Date.now()}.jpeg`
                await sharp(req.files.profileImage[0].buffer).resize(400,400).
                    toFormat('jpeg').jpeg({quality:90}).toFile(`uploads/users/${filename}`);
                req.body.profileImage=filename;
            };
        };
        next();
    }
);



let createUser=handler(
    async(req,res,next)=>{
        let user=await User.create(req.body);
        if(!user){
            return next(new apiError("Couldn't create user",400));
        };
        res.status(200).json({status:"success",result :user});
    }
);



let getUser=handler(
    async(req,res,next)=>{
        let user=await User.findById(req.params.id);
        if(!user){
            return next(new apiError("Couldn't find user",400));
        };
        res.status(200).json({status:"success",result :user});
    }
);




let updateUser=handler(
    async(req,res,next)=>{
        let user=await User.findByIdAndUpdate( 
            req.params.id , 
            req.body, 
            {new:true} ) ;
        if(!user){
            return next(new apiError("Couldn't find user",400));
        };
        res.status(200).json({status:"success",result :user});
    }
);

let updateUserPassword=handler(
    async(req,res,next)=>{
        req.body.password = await bcrybt.hash(req.body.password,12);
        let user=await User.findByIdAndUpdate( 
            req.params.id , 
            req.body, 
            {new:true} ) ;
        if(!user){
            return next(new apiError("Couldn't find user",400));
        };
        res.status(200).json({status:"success",result :user});
    }
);

let getUsers=handler(
    async(req,res,next)=>{
        let users=await User.find({}).sort('createdAt');
        if(!users){
            return next(new apiError("no users found",400));
        };
        res.status(200).json({status:"success",result :users});
    }
);

let updateLogggedUser=handler(
    async(req,res,next)=>{
        let user=await User.findByIdAndUpdate( 
            req.params.id , 
            req.body, 
            {new:true} ) ;
        if(!user){
            return next(new apiError("Couldn't find user",400));
        };
        res.status(200).json({status:"success",result :user});
    }
);

let updateLogggedUserPassword=handler(
    async(req,res,next)=>{
        let password=await bcrybt.hash(req.body.password,12)
        let user=await User.findByIdAndUpdate(req.user._id, 
        { 
            passwordChangedAt:Date.now(),
            password,
        },
            {
                new:true
            } ) ;
        if(!user){
            return next(new apiError("Couldn't find user",400));
        };
        res.status(200).json({status:"success",result :user});
    }
);

let getLoggedUser=handler(
    async(req,res,next)=>{
        let users=await User.find(req.user._id);
        res.status(200).json({status:"success",result :users});
    }
);

let forgetPassword=handler(
    async (req,res,next)=>{
        let {email}=req.body;
        let user=await User.findOne({email});
        if(!user){
            return next(new apiError('User not found' , 400));
        };
        let resetCode=`${Math.floor(100000 + Math.random() * 900000)}`;
        // console.log(resetCode);
        user.resetCode=await bcrybt.hash(resetCode,12);
        user.resetCodeExpiredAt=Date.now()+ 10*60*1000;
        user.resetCodeVertification=false;
        await user.save();
        let options={
            from:'chat-app-rooms',
            to:user.email,
            text:`hi ${user.name} your verification code to change password is ${resetCode}`,
            subject:`reset password`
        };
        try{
            await transport.sendMail(options);
        }catch(err){
            return next(new apiError(err,400));
        };
        res.status(200).json({status: 'success'});
    }
);
let vertifyResetCode=handler(
    async(req,res,next)=>{
        let {email,resetCode}=req.body;
        let user=await User.findOne({email});
        if(!user){
            return next(new apiError('User not found' , 400));
        };
        let validCode=await bcrybt.compare(resetCode,user.resetCode);
        console.log(validCode);
        if(!validCode){
            return next(new apiError('Invalid reset code' , 400));
        };
        if(user.resetCodeExpiredAt>Date.now()){
            user.resetCodeVertification=true;
        };
        await user.save();
        res.status(200).json({status: 'success'});
    }
);


let changePassword=handler(
    async(req,res,next)=>{
        let {password,email}=req.body;
        let user=await User.findOne({email});
        if(!user || !user.resetCodeVertification){
            return next(new apiError('User not found or vertification code not true' , 400));
        };
        user.password=await bcrybt.hash(password,12);
        user.resetCodeVertification=false;
        await user.save();
        let token=jwt.sign({userId:user._id} , process.env.SECRET_TOKEN);
        res.status(200).json({token,result:user})
    } 
);

module.exports={getUser,getUsers,updateUser,createUser,
    updateLogggedUserPassword,getLoggedUser,updateLogggedUser,
    forgetPassword,vertifyResetCode,changePassword,resizeImage,updateUserPassword};