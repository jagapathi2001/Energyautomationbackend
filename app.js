const express=require('express');
const app=express();
const http=require('http');
const { Server } = require('socket.io');
const server=http.createServer(app);
const db=require('./db/database.js');
const cors=require('cors');
require('dotenv').config({path:'./.env.development'});
const authentication=require('./routes/authentication.js');
const home=require('./routes/home.js');
const appliances=require('./routes/appliances.js')
db();

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use(cors({
    origin:true,
    credentials:true
}));
app.use('/',authentication);
app.use('/cords',home);
app.use('/appliances',appliances);

const io=new Server(server,{
    cors:{
        origin:true,
        methods:['POST','GET']
    }
});

io.on('connection',(socket)=>{
    // console.log('socketid',socket.id)
    // socket.on('cords',data=>{
    //     console.log('data',data);
    // })
});



server.listen('2000',()=>{console.log('Server started')});

