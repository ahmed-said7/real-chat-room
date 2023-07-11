let mongoose= require('mongoose');


let chatSchema=new mongoose.Schema(
    {
        members:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        }]
    },
    {
    timestamps: true,
    }
);


let chatModel = mongoose.model("Chat",chatSchema);
module.exports = chatModel;