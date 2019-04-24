// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// var app = express();
// var server = require('http').Server(app);
// var ejs = require('ejs');
// // var roomList = [];

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// // app.use(express.static(path.join(__dirname, 'public')));

// // view engine setup
// app.use('/views', express.static('views'));
// app.engine('html',ejs.renderFile)
// app.set('view engine', 'html');




// app.use('*',function(req,res,next){
//   res.setHeader('Access-Control-Allow-Origin',"*");
//   next()
// })


// server.listen(8000,()=>{
//   console.log('8000 is running')
// })












var axios = require('axios');




var db = axios.create({
  baseURL:'http://localhost:3000',
  timeout:10000
});
// var db = axios.create({
//   baseURL:'https://www.loveyyt.cn/data',
//   timeout:10000
// });

db.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});


var io = require('socket.io').listen(3020,{
  origins: '*:*'
}).sockets;



io.on('connection',socket=>{

  socket.on('logIn',data=>{
    socket.join(data.room);
    io.in(data.room).emit('sc',{refRoom:data.room,type:'system',content:data.name+'已加入房间'});
  });

  socket.on('logOut',data=>{
    socket.leave(data.room);
    io.in(data.room).emit('sc',{refRoom:data.room,type:'system',content:data.name+'已退出房间'});
  });

  socket.on('cs',data=>{
      db.request({
        url:'/insert',
        method:'POST',
        params:{
            collection:'test',
            docName:'msgs'
        },
        data:data.msg
    }).then(res=>{
      data.msg.objectId = res.objectId;
      data.msg.createdAt = res.createdAt;
      data.msg.updateAt = res.createdAt;
      let createUser = {
        objectId:data.msg.createUser,
        name:data.name
      }
      data.msg.createUser = createUser
      io.in(data.msg.refRoom).emit('sc',data.msg)
    }).catch(err=>{
      console.log(err);
    })
  });

  io.on('disconnect',data=>{
    console.log(data);
  })
})