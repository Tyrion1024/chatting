const axios = require('axios');
const db = axios.create({
    baseURL:'http://localhost:3000',
    timeout:10000
})




function testUserToken(cookies){
    return new Promise((resolve,reject)=>{
        try{
            let userToken = cookies.userToken;
            db.request({
                url:'/find',
                method:'GET',
                params:{
                    collection:'test',
                    docName:'user',
                    where:{
                        objectId:userToken
                    }
                }
            }).then(result=>{
                if(result.data.length>0){
                    resolve({code:0,msg:'验证通过'})
                }else{
                    resolve({code:1,msg:'验证未通过'})
                }
            }).catch(err=>{
                resolve({code:1,msg:'验证未通过',err:err})
            })
        }catch(err){
            console.log(err);
            resolve({code:1,msg:'验证未通过',err:err})
        }
    })
}



module.exports = {
    testUserToken
}