let router=require('express').Router();

let {login,signup,allowedTo,ptotected}=require('../services/authService');

let {getUser,getUsers,updateUser,createUser,updateLogggedUserPassword,
    getLoggedUser,updateLogggedUser,forgetPassword,vertifyResetCode,
    changePassword,resizeImage,updateUserPassword}=require('../services/userService');

let {uploadSingleImage,uploadMultipleImages}=require('../middlewares/uploadImage')


let {updateUserPaswordValidator,createUserValidator,
    getUserValidator,updateLoggedUserValidator,updateLoggedUserPaswordValidator,
    updateUserValidator
}=require('../validators/userValidator');

router.route('/login').post(login);


router.route('/signup').post(uploadMultipleImages([{name:"Images",maxCount:5},
        {name:"profileImage",maxCount:1}]),resizeImage,signup);

router.route('/forget-password').post(forgetPassword);

router.route('/get-me').post(ptotected,allowedTo('admin'),getLoggedUser);

router.route('/update-me').post(ptotected,allowedTo('admin'),
    updateLoggedUserValidator,updateLogggedUser);

router.route('/change-password').post(ptotected,allowedTo('admin'),
    updateLoggedUserPaswordValidator,updateLogggedUserPassword);

router.route('/vertify-code').post(vertifyResetCode);

router.route('/reset-password').post(changePassword);


router.route('/').post(ptotected,allowedTo('admin'),createUserValidator,createUser).
            get(ptotected,allowedTo('admin'),getUsers);


router.route('/:id').put(ptotected,allowedTo('admin'),updateUserValidator,updateUser)
            .get(ptotected,allowedTo('admin'),getUserValidator,getUser);


router.route('/:id/change-password').put(ptotected,allowedTo('admin'),
    updateUserPaswordValidator,updateUserPassword)




module.exports = router;