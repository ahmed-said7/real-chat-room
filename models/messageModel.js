let mongoose= require('mongoose');


let messageSchema=new mongoose.Schema(
    {
        chatId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Chat"
        },
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        recipientId:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
            }],
        message:String,
        Image:String
    },
    {
    timestamps: true,
    }
);

messageSchema.post('init',function(doc){
    if(doc.Image){
        url=`http://localhost:3000/users/${doc.Image}`;
        doc.Image=url;
    };
});

messageSchema.post('save',function(doc){
    if(doc.Image){
        url=`http://localhost:3000/users/${doc.Image}`;
        doc.Image=url;
    };
});

let messageModel=mongoose.model("Message",messageSchema);
module.exports = messageModel;