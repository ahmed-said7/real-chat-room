let express = require('express');
let app=express();
require('dotenv').config({path:'./environ.env'});
let connection=require('./config/database');
connection(process.env.URL);
let globalError=require('./middlewares/globalError')
let userRoute=require('./routes/userRoute');
let messageRoute=require('./routes/messageRoute');
let chatRoute=require('./routes/chatRoute');
const apiError = require('./utils/apiError');
app.use(express.json());
// app.use()

app.use(express.static('uploads'));


app.use('/api/v1/users',userRoute);
app.use('/api/v1/messages',messageRoute);
app.use('/api/v1/chats',chatRoute);

app.all('*',(req,res,next)=>{
    return next(new apiError('no route found',400))
});


app.use(globalError);
app.listen(3000,()=>{
    console.log('listening on http://localhost:300/');
});