var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./src/db.js');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));

app.all('*',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "http://140.143.234.130");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
})

app.get('/find',function(req,res,next){
    db.find(req).then(result=>{
        res.send(result);
    }).catch(err=>{
        res.send(err);
    })
})

app.put('/update',function(req,res,next){
    db.updateMany(req).then(result=>{
        res.send(result);
    }).catch(err=>{
        res.send(err);
    })
})

app.post('/insert',function(req,res,next){
    db.insertOne(req).then(result=>{
        res.send(result);
    }).catch(err=>{
        res.send(err);
    })
})

app.delete('/delete',function(req,res,next){
    db.deleteMany(req).then(result=>{
        res.send(result);
    }).catch(err=>{
        res.send(err);
    })
})

app.post('/batch',function(req,res,next){
    db.batch(req).then(result=>{
        res.send(result);
    }).catch(err=>{
        res.send(err);
    })
});

// let req = {
//     query: {
//         collection: 'test',
//         docName: 'user'
//     }
// }

// setTimeout(()=>{
//     db.find(req).then(result=>{
//         console.log(result)
//     })
// },2000)

app.listen(3000,() => console.log('user listening on port 3000!'));