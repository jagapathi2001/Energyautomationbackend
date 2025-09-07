const express=require('express');
const router=express.Router();
const cordsModel=require('../models/cords.js')




router.post('/',async(req,res)=>{
    const {cords,id}=req.body;

    console.log(cords,id);
    if(!cords || !id)
    {
       return res.status(400).json({success:false,message:'Field cannot be empty!'});
    }
    try
    {
        const exist=await cordsModel.findOne({"userid":id});
        if(!exist)
            {
                await cordsModel.create({userid:id,cords:cords});
                return res.status(200).json({success:true,message:'Cords created'});
            }
        
            exist.cords=cords;
            await exist.save()
        return res.status(200).json({success:true,message:'Cords updated'});
    }
    catch(error)
    {
        return res.status(500).json({success:false,message:error});
    }

})


router.post('/getcords',async(req,res)=>{
    const {id}=req.body;

    console.log(id);
    if( !id)
    {
       return res.status(400).json({success:false,message:'Field cannot be empty!'});
    }
    try
    {
        const exist=await cordsModel.findOne({"userid":id});
        if(!exist)
            {
                return res.status(400).json({success:false,message:'No cords found!'});

            }

        return res.status(200).json({success:true,message:'Cords found',data:exist});
    }
    catch(error)
    {
        return res.status(500).json({success:false,message:error});
    }

})


module.exports=router;