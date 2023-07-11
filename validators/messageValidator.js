let {check}=require('express-validator');
let validationMiddleware=require('../middlewares/validationMiddleware');
let Chat=require('../models/chatModel');

let User=require('../models/userModel');
let createMessageValidator=[
    check('chatId').notEmpty().withMessage('chatId is required')
    .isMongoId().withMessage('invalid format').
    custom((val,{req})=>{
        Chat.findById(val).then((chat)=>{
            if(!chat){
                return Promise.reject(new Error('chat not found'));
            };
        })
        return true;
    }),check('recipientId').optional()
    .isMongoId().withMessage('invalid format').custom((val,{req})=>{
            User.findById(val).then((user)=>{
                if(!user){
                    return Promise.reject(new Error('user not found'));
                };
            });
            return true;
    }),validationMiddleware
];
let updateMessageValidator=[
    check('id').isMongoId().withMessage('invalid format'),validationMiddleware
];
let deleteMessageValidator=[
    check('id').isMongoId().withMessage('invalid format'),validationMiddleware
];
let getMessagesValidator=[
    check('chatId').isMongoId().withMessage('invalid format'),validationMiddleware
];
module.exports={updateMessageValidator,deleteMessageValidator,
    getMessagesValidator,createMessageValidator};