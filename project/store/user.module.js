const util = require('../src/common/util.js')

const store = {
    namespaced:true,
    state: {
        userInfo:{}
    },
    mutations: {
        setUserInfo(state,obj){
            state.userInfo = obj
        }
    },
    actions: {
        login(context,data){
            return new Promise((resolve,reject)=>{
                util.httpAjax('/user/login','POST',{},data).then(res=>{
                    if(res.code === 0){
                        context.commit('setUserInfo',res.data);
                    }
                    resolve(res);
                }).catch(err=>{
                    console.log(err);
                    reject(err);
                })
            })
        },      
        register(context,data){
            return new Promise((resolve,reject)=>{
                util.httpAjax('/user/register','POST',{},data).then(res=>{
                    if(res.code === 0){
                        context.commit('setUserInfo',res.data)
                    }
                    resolve(res)
                }).catch(err=>{
                    console.log(err);
                    reject(err);
                })
            })
        },
        testUserName(context,params){
            return new Promise((resolve,reject)=>{
                util.httpAjax('/user/testUserName','GET',params).then(res=>{
                    resolve(res)
                }).catch(err=>{
                    console.log(err);
                    reject(err);
                })
            })
        },
        testUserToken(context){
            return new Promise((resolve,reject)=>{
                util.httpAjax('/user/testUserToken','GET',{}).then(res=>{
                    if(res.code){
                        context.commit('setUserInfo',{})
                    }else{
                        context.commit('setUserInfo',res.data);
                    }
                    resolve(res);
                }).catch(err=>{
                    reject(err);
                })
            })
        },  
        logout(context){
            return new Promise((resolve,reject)=>{
                util.httpAjax('/user/logout','POST',{}).then(res=>{
                    if(res.code === 0){
                        context.commit('setUserInfo',{})
                    }
                    resolve(res);
                }).catch(err=>{
                    console.log(err);
                    reject(err);
                })
            })
        }
    }
}


export default store