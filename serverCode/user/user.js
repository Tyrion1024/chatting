const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const axios = require('axios');
const token = require('./src/token.js')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




app.use(express.static(path.join(__dirname, 'public')));

const db = axios.create({
    baseURL:'http://localhost:3000',
    timeout:10000
})

app.all('*', function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "*");
	res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.setHeader("X-Powered-By", ' 3.2.1');
	res.setHeader("Access-Control-Allow-Credentials",true);
	res.setHeader("Content-Type", "application/json;charset=utf-8");
	next();
});



app.post('/login',function(req,res,next){
    let userInfo = {username:'',password:''};
    try{
        userInfo = req.body;
        db.request({
            url:'/find',
            method:'GET',
            params:{
                collection:'test',
                docName:'user',
                where:userInfo
            }
        }).then(result=>{
            if(result.data.length>0){
                res.cookie('userToken',result.data[0].objectId,{maxAge:1000*3600*24,httpOnly:true})
                res.send({code:0,data:result.data[0],msg:'登陆成功'})
            }else{
                res.send({code:0,msg:'登陆失败，账号或密码输入错误'})
            }
        }).catch(err=>{
            console.log(err)
            res.send({code:2,msg:'登陆失败，程序可能出了问题'})
        }) 
    }catch(err){
        console.log(err)
        res.send({code:2,msg:'登陆失败，程序可能出了问题'})
    }
})


app.post('/register',function(req,res,next){
    console.log(req.body)
    let userInfo = {name:'',password:''};
    try{
        userInfo = req.body;
        db.request({
            url:'/find',
            method:'GET',
            params:{
                collection:'test',
                docName:'user',
                where:{
                    name:userInfo.name
                }
            }
        }).then(result=>{
            if(result.data.length>0){
                return new Promise(resolve=>{
                  resolve({code:1,msg:'用户名已被占用'})  
                })
            }else{
                return db.request({
                    url:'/insert',
                    method:'POST',
                    params:{
                        collection:'test',
                        docName:'user'
                    },
                    data:userInfo
                })
            }
        }).then(result=>{
            // console.log(result)
            if(result.code&&result.code === 1){
                res.send(result)
            }else{
                delete userInfo.password;
                Object.assign(userInfo,result.data);
                userInfo.updatedAt = userInfo.createdAt;
                res.cookie('userToken',userInfo.objectId,{maxAge:1000*3600*24,httpOnly:true});
                let r = {code:0,data:userInfo,msg:'注册成功'};
                res.send(r)
            }
        }).catch(err=>{
            console.log(err)
            res.send({code:2,msg:'注册失败，程序可能出了问题'})
        })  
    }catch(err){
        console.log(err)
        res.send({code:2,msg:'注册失败，程序可能出了问题'})
    }

})


app.get('/testUserName',function(req,res,next){
    try{
        db.request({
            url:'/find',
            method:'GET',
            params:{
                collection:'test',
                docName:'user',
                where:{
                    name:req.query.userName
                }
            }
        }).then(result=>{
            if(result.data.length>0){
                res.send({code:0,msg:'用户名已被占用'})
            }else{
                res.send({code:1,msg:'用户名未被占用'})
            }
        })
    }catch(err){
        console.log(err);
        res.send({code:1,msg:'程序可能出错了喔'})
    }
})

app.get('/testUserToken',function(req,res,next){
    try{
        token.testUserToken(req.cookies).then(result=>{
            if(result.code === 0){
                res.send({code:o,msg:'验证通过'})
            }else{
                res.send({code:1,msg:'验证未通过'})
            }
        }).catch(err=>{
            res.send({code:1,msg:'验证未通过'})
        })
    }catch(err){
        console.log(err);
        res.send({code:1,msg:'验证未通过'})
    }
})

app.post('/logout',function(req,res,next){
    res.clearCookie('userToken');
    res.send({code:0,msg:"logout success"})
})

app.listen(3010,()=>{
    console.log('userSystem listen 3010')
});
