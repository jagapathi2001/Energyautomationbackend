const mongoose=require('mongoose');

const db=async()=>{
    try {
        const connect=await mongoose.connect(process.env.MONGO_URI,{dbName:"energyautomation"});
        console.log('Database connected');
       
    } catch (error) {
        console.log('db',error);
    }
}
module.exports=db;