let mongoose = require('mongoose');


let connection=(url)=>{
    mongoose.connect(url).then((conn)=>{
        console.log('Connection established');
    }).catch((err)=>{
        console.log(err);
    });
};

module.exports=connection;