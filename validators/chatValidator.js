let {check}=require('express-validator');
let validationMiddleware=require('../middlewares/validationMiddleware');
let Chat=require('../models/chatModel');

let User=require('../models/userModel');
let createChatValidator=[
    check('members').notEmpty().withMessage('chatId is required')
    .isMongoId().withMessage('invalid format').
    custom((val,{req})=>{
        if(val.includes(req.user._id.toString())){
            val.push(req.user._id.toString());
        };
        User.find({_id:{$in:val}}).then((users)=>{
            if(users.length!== val.length){
                return Promise.reject(new Error('no users found'));
            };
        });
        return true;
    })
    ,validationMiddleware
];


let deleteChatValidator=[
    check('id').isMongoId().withMessage('invalid format'),validationMiddleware
];
let getChatValidator=[
    check('userId').isMongoId().withMessage('invalid format'),validationMiddleware
];
module.exports={deleteChatValidator,
    getChatValidator,createChatValidator};