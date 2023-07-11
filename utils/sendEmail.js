let dotenv = require('dotenv');
dotenv.config({path:"./environ.env"});
console.log(process.env.SECRET_TOKEN);
let nodemailer=require('nodemailer');

let transport=nodemailer.createTransport({
        service:'gmail',host:"smtp.gmail.com",secure:false,port:587
        ,auth:{
            user:process.env.EMAIL,pass:process.env.PASS
        }, enable_starttls_auto: true,
    });

module.exports=transport;