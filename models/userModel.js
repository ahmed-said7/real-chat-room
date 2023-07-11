let mongoose= require('mongoose');
let bcrypt= require('bcryptjs');

let userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },
        password:{
            type:String,
            required:true,
            trim:true,
            minlength:[6,'password is too short']
        },
        Images:[String],
        profileImage:String,
        passwordChangedAt:Date,
        role:{
            type:String,
            default:'user',
            enum:['admin','user']
        },
        phone:String,
        resetCode:String,
        resetCodeExpiredAt:Date,
        resetCodeVertification:Boolean,
        friends:[{
            type:mongoose.Schema.Types.ObjectId,ref:'User'
        }]
    },
    {
    timestamps: true,
    }
);

userSchema.post('init',function(doc){
    if(doc.Images){
        let url;
        let images=[];
        doc.Images.forEach((img)=>{
            url=`http://localhost:3000/users/${img}`;
            images.push(url);
        });
        doc.Images=images;
    };
    if(doc.profileImage){
        url=`http://localhost:3000/users/${doc.profileImage}`;
        doc.profileImage=url;
    };
});

userSchema.post('save',function(doc){
    if(doc.Images){
        console.log(doc.Images);
        let url;
        let images=[];
        doc.Images.forEach((img)=>{
            url=`http://localhost:3000/users/${img}`;
            images.push(url);
        });
        doc.Images=images;
    };
    if(doc.profileImage){
        url=`http://localhost:3000/users/${doc.profileImage}`;
        doc.profileImage=url;
    };
});


userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    };
    this.password=await bcrypt.hash(this.password,12);
    next();
});

let userModel=mongoose.model("User",userSchema);
module.exports = userModel;