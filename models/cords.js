const mongoose=require('mongoose');

const schema=mongoose.Schema({
    userid:{
        type:mongoose.Schema.ObjectId,
        required:true,
    },
    cords:{
        type:Object,
        required:true,
    }
})

const cordsModel=mongoose.model('cords',schema);
module.exports=cordsModel;