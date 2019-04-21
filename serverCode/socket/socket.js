var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var server = require('http').Server(app);
var ejs = require('ejs');
// var roomList = [];

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.use('/views', express.static('views'));
app.engine('html',ejs.renderFile)
app.set('view engine', 'html');

var io = require('socket.io').listen(3000,{
  origins: '*:*'
}).sockets;



io.on('connection',socket=>{

  socket.on('logIn',data=>{
    if(!socket._rooms.find(item=>{return item === data.room})){
      socket._rooms.push(data.room);
    }
    socket.join(data.room);
    socket.to(data.room).emit('sc',{msg:data.name+'已加入房间'});
  });

  socket.on('logOut',data=>{
    socket.leave(data.room);
    socket.to(data.room).emit('sc',{msg:data.name+'已退出房间'});
  });

  socket.on('cs',data=>{
    socket.to(data.room).emit('sc',{msg:data.msg})
  });

  io.on('disconnect',data=>{
    console.log(data);
  })
})



app.use('*',function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin',"*");
  next()
})


server.listen(8000,()=>{
  console.log('8000 is running')
})
