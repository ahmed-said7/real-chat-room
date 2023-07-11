let globalError=(err,req,res,next)=>{
    console.log(err);
        return res.status(400).json({
            message:err.message,
            status:err.status,
            statusCode:err.statusCode,
            error:err
        });
};

module.exports=globalError;