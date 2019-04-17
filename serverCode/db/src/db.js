var mongodb = require('mongodb');
var assert = require('assert');
var async = require('async');


function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n
}


//yyyy-mm-dd hh:mm:ss
function formatDateTime(tmpDt, Delimiter1, Delimiter2) {
    let tmpStr1 = Delimiter1 ? Delimiter : '-'
    let tmpStr2 = Delimiter2 ? Delimiter : ':'

    let year = tmpDt.getFullYear()
    let month = tmpDt.getMonth() + 1
    let day = tmpDt.getDate()

    let hour = tmpDt.getHours()
    let minute = tmpDt.getMinutes()
    let second = tmpDt.getSeconds()

    return [year, month, day].map(formatNumber).join(tmpStr1) + ' ' + [hour, minute, second].map(formatNumber).join(tmpStr2)
}

let dataBase = {};


function getConnect() {
    mongodb.MongoClient.connect('mongodb://140.143.234.130:27017', { useNewUrlParser: true }, function (err, db) {
        assert.equal(err, null);
        dataBase = db;
    })
}

getConnect();






function find(req) {
    return new Promise(resolve => {
        try {
            const collection = dataBase.db(req.query.collection);
            const db = collection.collection(req.query.docName);
            let body = [{
                "$sort":{
                    "updatedAt":-1
                }
            },{
                "$project":{
                    "_id":0
                },
            }
        ];
            if(req.query.keys){
                let project = {};
                let tmpArr = req.query.keys.split('|');
                tmpArr.forEach(el=>{
                    project[el] = 1;
                });
                body.push({
                    "$project":project
                })
            }
    
            if(req.query.where){
                body.push({
                    "$match":JSON.parse(req.query.where)
                }) 
            }
    
            if(req.query.include){
                req.query.include.forEach(el=>{
                    body.push({
                        "$lookup":{
                            from:el.from,
                            as:el.as,
                            localField:el.localProp,
                            foreignField:el.foreignProp
                        }
                    })
                })
            }
    
            if(req.query.limit){
                body.push({
                    "$limit":req.query.limit
                })
            }
    
            if(req.query.group){
                body.push({
                    "$group":req.query.group
                })
            }
    
            if(req.query.skip){
                body.push({
                    "$skip":req.query.skip
                })
            }
    
            if(req.query.sort){
                let tmpArr = req.query.sort.split(',');
                let sort = {}
                tmpArr.forEach(el=>{
                    if(el[0] === -1){
                        sort[el.substring(1)] = -1
                    }else{
                        sort[el] = 1
                    }
                })
                body[0] = {
                    "$sort":sort
                }
            }
    
            db.aggregate(body).toArray(function(err,result){
                if(err){
                    console.log(err)
                    resolve({code:1,errmsg:'aggregate error',err,err})            
                }else{
                    result.forEach(el=>{
                        delete el.password;
                    })
                    resolve(result)
                }
            })    
        } catch (error) {
            console.log(error);
            resolve({code:1,errmsg:'aggregate error',error})            
        }
    })
}






function insertOne(req) {
    return new Promise(resolve => {
        const collection = dataBase.db(req.query.collection);
        const db = collection.collection(req.query.docName);
        let data = req.body;
        data.objectId = '' + Math.floor(Math.random()*100) + new Date().getTime() + Math.ceil(Math.random()*100);
        data.createdAt = formatDateTime(new Date());
        data.updatedAt = formatDateTime(new Date());
        db.insertOne(req.body, function (error, result) {
            if (error) {
                resolve(error);
            } else {
                let res = {
                    objectId: result.ops[0].objectId,
                    createdAt: result.ops[0].createdAt
                }
                resolve(res);
            }
        })
    })
}

function insertMany(req) {
    return new Promise(resolve => {
        const collection = dataBase.db(req.query.collection);
        const db = collection.collection(req.query.docName);
        let data = req.body.ops;
        data.forEach(element => {
            element.objectId = '' + Math.floor(Math.random()*100) + new Date().getTime() + Math.ceil(Math.random()*100);
            element.createdAt = formatDateTime(new Date());
            element.updatedAt = formatDateTime(new Date());
        });
        db.insertMany(data, function (error, result) {
            if (error) {
                resolve(error);
            } else {
                let res = [];
                result.ops.forEach(element => {
                    res.push({
                        objectId: element.objectId,
                        createdAt: element.createdAt
                    })
                })
                resolve(res);
            }
        })
    })
}



function deleteMany(req) {
    return new Promise(resolve => {
        const collection = dataBase.db(req.query.collection);
        const db = collection.collection(req.query.docName);
        db.deleteMany(JSON.parse(req.query.where), function (error, result) {
            if (error) {
                resolve(error);
            } else {
                resolve(result.result);
            }
        })
    })
}


function deleteOne(req) {
    return new Promise(resolve => {
        const collection = dataBase.db(req.query.collection);
        const db = collection.collection(req.query.docName);
        db.deleteOne(JSON.parse(req.query.where), function (error, result) {
            if (error) {
                resolve(error);
            } else {
                resolve(result.result);
            }
        })
    })
}


function updateOne(req) {
    return new Promise(resolve => {
        const collection = dataBase.db(req.query.collection);
        const db = collection.collection(req.query.docName);
        if (req.body.objectId || req.body.createdAt || req.body.updatedAt) {
            resolve({ code: 1, msg: "can not update 'objectId createdAt updatedAt'" })
        }
        let data = {
            "$set": req.body
        };
        data.$set.updatedAt = formatDateTime(new Date());
        db.updateOne(JSON.parse(req.query.where), data, function (error, result) {
            if (error) {
                console.log(error)
                resolve(error);
            } else {
                resolve({ updatedAt: data.$set.updatedAt });
            }
        })
    })
}


function updateMany(req) {
    return new Promise(resolve => {
        const collection = dataBase.db(req.query.collection);
        const db = collection.collection(req.query.docName);
        if (req.body.objectId || req.body.createdAt || req.body.updatedAt) {
            resolve({ code: 1, msg: "can not update 'objectId createdAt updatedAt'" })
        }
        let data = {
            "$set": req.body
        };
        data.$set.updatedAt = formatDateTime(new Date());
        db.updateMany(JSON.parse(req.query.where), data, function (error, result) {
            if (error) {
                console.log(error)
                resolve(error);
            } else {
                resolve({ updatedAt: data.$set.updatedAt });
            }
        })
    })
}






function batch(req) {
    return new Promise(resolve => {
        let requests = [];
        try {
            req.body.forEach(el => {
                if (el.method === 'PUT') {
                    let tempReq = {
                        query: {
                            collection: el.collection,
                            docName: el.docName,
                            where: el.where
                        },
                        body: el.body
                    };
                    requests.push(updateMany(tempReq))
                } else if (el.method === 'POST') {
                    let tempReq = {
                        query: {
                            collection: el.collection,
                            docName: el.docName
                        },
                        body: el.body
                    };
                    requests.push(insertMany(tempReq))
                } else if (el.method === 'DELETE') {
                    let tempReq = {
                        query: {
                            collection: el.collection,
                            docName: el.docName,
                            where: el.where
                        }
                    };
                    requests.push(deleteMany(tempReq))
                }
            });
            resolve(Promise.all(requests))
        } catch (err) {
            resolve(err)
        }
    })
}




module.exports = {
    find,
    insertMany,
    insertOne,
    deleteMany,
    deleteOne,
    updateMany,
    updateOne,
    batch
}