let {validationResult}=require('express-validator');

let validationMiddleware=(req,res,next)=>{
    let error=validationResult(req);
    if(!error.isEmpty()){
        console.log(error);
        return res.status(400).json({errors:error.array()});
    };
    next();
};
module.exports=validationMiddleware;