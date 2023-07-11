let {check}=require('express-validator');
let validationMiddleware=require('../middlewares/validationMiddleware');
let User=require('../models/userModel');
let bcrybt=require('bcryptjs');


let createUserValidator=[
    check('email').notEmpty().withMessage('email is required').isEmail().withMessage('invalid format').
    custom((val,{req})=>{
        User.findOne({email:val}).then((user)=>{
            if(user){
                return Promise.reject('email shouldbe unique');
            };
        });
        return true;
    }),
    check('name').notEmpty().withMessage('name is required ').
    isLength({min:3}).withMessage('name is too short').
    isLength({min:19}).withMessage('name is too long')
    ,check('passsword').notEmpty().withMessage('passsword is required').
    custom((val,{req})=>{
        if(val !== req.body.passwordConfirm){
            return Promise.reject('passwordConfirm is not correct');
        };
    }) ,
    validationMiddleware
];

let updateUserValidator=[
    check('id').isMongoId().withMessage('invalidFormat'),
    check('email').optional().isEmail().withMessage('invalid format').
    custom((val,{req})=>{
        User.findOne({email:val}).then((user)=>{
            if(user){
                return Promise.reject('email shouldbe unique');
            };
        });
        return true;
    }),
    validationMiddleware
];

let updateUserPaswordValidator=[
    check('id').isMongoId().withMessage('invalidFormat'),
    check('currentPassword').notEmpty().withMessage('current password is rquired').
    custom(async(val,{req})=>{
        let user=User.findOne({_id:req.params.id});
        if(!user){
            return Promise.reject('no user found');
        }
        let valid=await bcrybt.compare(val,user.password);
        if(!valid){
            return Promise.reject('current password is not correct');
        };
        return true;
    }),
    check('passsword').notEmpty().withMessage('passsword is required').
    custom((val,{req})=>{
        if(val !== req.body.passwordConfirm){
            return Promise.reject('passwordConfirm is not correct');
        };
    })
    ,validationMiddleware
];

let updateLoggedUserPaswordValidator=[
    check('currentPassword').notEmpty().withMessage('current password is rquired').
    custom(async(val,{req})=>{
        let user=req.user;
        let valid=await bcrybt.compare(val,user.password);
        if(!valid){
            return Promise.reject('current password is not correct');
        };
        return true;
    }),
    check('passsword').notEmpty().withMessage('passsword is required').
    custom((val,{req})=>{
        if(val !== req.body.passwordConfirm){
            return Promise.reject('passwordConfirm is not correct');
        };
    })
    ,validationMiddleware
];

let updateLoggedUserValidator=[
    check('id').isMongoId().withMessage('invalidFormat'),
    check('email').optional().isEmail().withMessage('invalid format').
    custom((val,{req})=>{
        User.findOne({email:val}).then((user)=>{
            if(user){
                return Promise.reject('email shouldbe unique');
            };
        });
        return true;
    }),
    validationMiddleware
];

let getUserValidator=[
    check('id').isMongoId().withMessage('invalidFormat'),
    validationMiddleware
];


module.exports=[updateUserPaswordValidator,createUserValidator,
    getUserValidator,updateLoggedUserValidator,updateLoggedUserPaswordValidator,
    updateUserValidator
];