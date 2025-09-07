const express=require('express');
const router=express.Router();
const registerModel=require('../models/register.js')


router.post('/register',async(req,res)=>{
    const {name,email,password}=req.body;

    console.log(name,email,password);
    if(!name || !email || !password)
    {
       return res.status(400).json({success:false,message:'Field cannot be empty!'});
    }
    try
    {
        const exist=await registerModel.findOne({"email":email});
        if(exist)
            return res.status(400).json({success:false,message:'User already exist'});
    
        const newUser=new registerModel({name,email,password});
        await newUser.save();
        return res.status(200).json({success:true,message:'New user created'});
    }
    catch(error)
    {
        return res.status(500).json({success:false,message:error});
    }

})

router.post('/login',async (req,res)=>{

    const {email,password}=req.body;


    if( !email || !password)
    {
       return res.status(400).json({success:false,message:'Field cannot be empty!'});
    }
    try
    {
        const exist=await registerModel.findOne({"email":email});
        
        if(!exist)
            return res.status(404).json({success:false,message:'User not exist!'});

            console.log(exist)
        if(exist.password!==password)
        {
               console.log(password)
             return res.status(401).json({success:false,message:'Password incorrect!'});
           
        }
           

        return res.status(200).json({success:true,message:'Login successfull',data:exist});
    }
    catch(error)
    {
          console.log(error)
        return res.status(500).json({success:false,message:error});
    }

})

module.exports=router;