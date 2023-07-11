

let handler=require('express-async-handler');
let Chat=require('../models/chatModel');
let User=require('../models/chatModel');
const apiError = require('../utils/apiError');

let createChat=handler(
    async(req,res,next)=>{
        let {recipientId}=req.body;
        let chat=await Chat.create(req.body);
        if(!chat){
            return next(new apiError('could not create message',400));
        };
        // let user=await User.findByIdAndUpdate(req.user._id,{$addToSet:{friends:recipientId}},{new:true});
        res.status(200).json({result:chat,status:"successs"});
    }
);

let getChats=handler(
    async(req,res,next)=>{
        // console.log('mmm...1');
        let chats=await Chat.find({members:{$all:[req.user._id]}}).sort('createdAT');
        if(!chats){
            return next(new apiError('could not create message',400));
        };
        // console.log(chats[0])
        // console.log('mmm...2');
        res.status(200).json({result:chats,status:"successs"});
    }
);

let getChat=handler(
    async(req,res,next)=>{
        let userId=req.params.userId;
        let chats=await Chat.find(
            {members:{$all:[req.user._id,userId]}}
            );
            if(!chats){
            return next(new apiError('could not create message',400));
        };
        
        res.status(200).json({result:chats,status:"successs"});
    }
);

let deleteChat=
handler(
    async(req,res,next)=>
    {
        let chat=await Chat.findById(req.params.id);
        if(!chat){
            return next(new apiError('could not delete chat',400));
        };
        if(!chat.members.includes(req.user._id.toString())){
            return next(new apiError('could not delete chat',400));
        };
        await chat.delete();
        res.status(200).json({result:chat,status:"successs"});
    }
);

module.exports={createChat,deleteChat,getChats,getChat};