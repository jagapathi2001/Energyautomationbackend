const express=require('express');
const router=express.Router();
const applianceModel=require('../models/appliances.js')

const path = require("path");
const GoogleAssistant = require("google-assistant");
const { send } = require('process');


router.post('/create-appliance',async(req,res)=>{
    const {name,id}=req.body;

    if(!name || !id )
    {
       return res.status(400).json({success:false,message:'Field cannot be empty!'});
    }
    try
    {
        const exist=await applianceModel.findOne({"userid":id,name:name});
        if(exist)
            {
                return res.status(400).json({success:false,message:'Appliance already present!'});
            }
         
            await applianceModel.create({userid:id,name:name});

        return res.status(200).json({success:true,message:'Appliance created!'});
    }
    catch(error)
    {
        return res.status(500).json({success:false,message:error});
    }

})



router.post('/control-appliance',async(req,res)=>{
    const {status,id}=req.body;

    console.log('stat',status,id);
    if(status==null || !id )
    {
       return res.status(400).json({success:false,message:'Field cannot be empty!'});
    }
    try
    {
        const exist=await applianceModel.findOne({userid:id});
        if(!exist)
            return res.status(400).json({success:false,message:'No appliance found with associated id!'});

        const command= `Turn ${status===false?'off':'on'} ${exist.name}`;

        console.log('command',command,status);
        sendCommand(command,res);
        // console.log('exist',exist);
        await applianceModel.updateMany({userid:id},{$set:{status}})

        return res.status(200).json({success:true,message:'All Appliances turned on!'});
    }
    catch(error)
    {
              console.log(error,'ero')
        return res.status(500).json({success:false,message:error});
    }

})

router.get('/appliances', async (req, res) => {
    const {id}=req.query;
    if(!id)
    return res.status(400).json({success:false,message:'No id found'});

    try{
        const appliances = await applianceModel.find({ userid: req.query.id });

        if(appliances.length<1)
            return res.status(400).json({success:false,message:'No appliances found!'});

        return res.status(200).json({success:true,message:'All Appliances fetched!',data:appliances});
    }
    catch(error)
    {
        return res.status(500).json({success:false,message:error});
    }
});



const clientConfig = path.resolve(__dirname, "../client_secret_176161973996-ag09lhj23lcn850di3qarrccqkva6o9s.apps.googleusercontent.com.json");
const authConfig = path.resolve(__dirname, "../oauth2.json");


const startConversation = (conversation) => {

  conversation.on("response", (text) => {
    console.log("response",text)
  if (text && text.trim() !== "") {
    console.log("Assistant (speech):", text);
  }
})
.on("screen-data", (screen) => {
  try {
    const screenHtml = screen.data.toString("utf8");
    // Extract visible text
    const textOnly = screenHtml
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (textOnly) {
    //   console.log("Assistant (screen):", textOnly);
    }
  } catch (e) {
    console.log("Assistant (screen raw):", screen);
  }
})
.on('device-action', (data) => {
  console.log('Device Action Response:', JSON.stringify(data, null, 2));
})
    .on("transcription", (data) => {
      console.log("You said:", data.transcription, "(final:", data.done, ")");
    })
    .on("end-of-utterance", () => {
      console.log("Finished speaking.");
    })
    .on("ended", (error, continueConversation) => {
      if (error) console.error("Conversation ended with error:", error);
      else console.log("Conversation ended normally");
    })
    .on("error", (error) => {
      console.error("Conversation error:", error);
    });
};

const sendCommand= (command,res) => {

  if (!command) {
    return res.status(400).json({ message: "Command not provided" });
  }

  const assistant = new GoogleAssistant({
    keyFilePath: clientConfig,
    savedTokensPath: authConfig
  });

  const conversationConfig = {
    lang: "en-US",
    textQuery: command,
    isNew: true,
    screen: { isOn: true }
  };

  assistant
    .on("ready", () => {
      console.log("Assistant is ready ✅");
      assistant.start(conversationConfig, (conversation) => startConversation(conversation, res));
    })
    .on("error", (err) => {
      console.error("Assistant global error:", err);
      res.status(500).json({ error: err.message });
    });
}




module.exports=router;