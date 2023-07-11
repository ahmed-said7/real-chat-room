let handler=require('express-async-handler');
let Message=require('../models/messageModel');
const apiError = require('../utils/apiError');
let Chat=require('../models/chatModel');
let sharp=require('sharp');
let uuid=require('uuid');



let resizeImage=handler(
    async(req,res,next)=>{
        if(req.file){
            let filename=`message-${uuid.v4()}-${Date.now()}.jpeg`;
            await sharp(req.file.buffer).resize(600,600).toFormat('jpeg').jpeg({quality:90})
            .toFile(`uploads/messages/${filename}`);
            req.body.Image=filename;
        };
        next();
    }
);


let createMessage=handler(
    async(req,res,next)=>{
        let message=await Message.create(req.body);
        let chat=await Chat.findById(req.body.chatId);
        let Ids=chat.members.filter((ele)=>{return ele !== req.user._id.toString();});
        message.senderId=req.user._id;
        message.recipientId=Ids;
        await message.save();
        res.status(200).json({result:message,status:"successs"});
    }
);


let allowToDeleteAndUpdate=handler(
    async(req,res,next)=>{
        let message=await Message.findById(req.params.id).
                            populate({path:"chatId",select:"members -_id"});
        if(!message){
            return next(new apiError('no message for id',400));
        };
        if(!message.chatId.members.includes(req.user._id.toString())){
            return next(new apiError('you can not delete message',400));
        };
        next();
    }
);

let updateMessage=handler(
    async(req,res,next)=>{
        let message=await Message.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json({result:message,status:"successs"});
    }
);

let deleteMessage=handler(
    async(req,res,next)=>{
        let message=await Message.findByIdAndDelete(req.params.id);
        res.status(200).json({result:message,status:"successs"});
    }
);

let getChatMessages=handler(
    async(req,res,next)=>{
        let chatId=req.params.chatId;
        let messages=await Message.find({chatId});
        if(!messages){
            return next(new apiError('could not delete message',400));
        };
        res.status(200).json({result:messages,status:"successs"});
    }
);

module.exports={getChatMessages,deleteMessage,updateMessage,createMessage,allowToDeleteAndUpdate,resizeImage};