let multer=require('multer');
const apiError = require('../utils/apiError');

let uploadImage=()=>{
    let filter=function(req,file,cb){
        if(file.mimetype.startsWith('image/')){
            return cb(null,true);
        }else{
            return cb(new apiError('allowed Images only',400),false);
        };
    };
    let upload=multer({
        storage:multer.memoryStorage(),fileFilter:filter
    });
    return upload;
};

let uploadSingleImage=(ele)=>{
    return uploadImage().single(ele);
};

let uploadMultipleImages=(ele)=>{
    return uploadImage().fields(ele);
};

module.exports={uploadSingleImage,uploadMultipleImages};