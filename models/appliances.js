const mongoose=require('mongoose');

const schema=mongoose.Schema({
    userid:{
        type:mongoose.Schema.ObjectId,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:['on','off'],
        default:'off'
    }
})

const applianceModel=mongoose.model('appliances',schema);

module.exports=applianceModel;