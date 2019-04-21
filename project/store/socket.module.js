

const util = require('../src/common/util.js');
import io from 'socket.io-client';

const store = {
    namespaced:true,
    state: {
        currentIO:{}
    },
    mutations: {
        setCurrentIO(state,currentIO){
            state.currentIO = currentIO
        }
    },
    actions: {
        getConnection(context,val){
            return new Promise((resolve,reject)=>{
                let baseUrl = 'http://192.168.0.103:3000',room = '/IO'+val;
                let socket = io.connect(baseUrl);
                
                context.commit('setCurrentIO',socket)
                // console.log(socket)
                
                socket.on('connect',  (res)=>{
                    resolve('链接成功')
                });
                socket.on('disconnect', (res)=>{
                    console.log('client disconnect:', res);
                });
                socket.on('sc',res=>{
                    console.log('sc',res)
                    // document.write(res.msg)
                })
            })
        }
    }
}


export default store