const util = require('../src/common/util.js')
import io from 'socket.io-client';
// let baseUrl = 'http://localhost:3020';
// let baseUrl = 'ws://140.143.234.130:3020';
let baseUrl = 'https://www.loveyyt.cn';


// room = {
//     objectId:'',
//     title:'',
//     discription:'',
//     createUser:'',
//     createdAt:'',
//     updatedAt:''
// }
const store = {
    namespaced:true,
    state: {
        myRoom:[],
        currentIO:{}
    },
    mutations: {
        setMyRoom(state,arr){
            state.myRoom = arr
        },
        setCurrentIO(state,currentIO){
            state.currentIO = currentIO
        }
    },
    actions: {
        getMyRoom(context,roomArr){
            return new Promise((resolve,reject)=>{
                if(!roomArr||!roomArr.length){
                    roomArr = context.rootState.user.userInfo.myRoom;
                }else{
                    resolve([]);
                }
                let params = {
                    collection:'test',
                    docName:'chatRoom',
                    where:{
                        "objectId":{
                            "$in":roomArr
                        }
                    },
                    include:[
                        {
                            from:"msgs",
                            as:'msgs',
                            localField:"objectId",
                            foreignField:"refRoom"
                        },
                        {
                            from:"user",
                            as:"createUser",
                            localField:"createUser",
                            foreignField:"objectId"
                        }
                    ]
                }
                util.httpAjax('/data/find','GET',params,{}).then(res=>{
                    let myRoom = context.state.myRoom;
                    res.forEach(element => {
                        let i = myRoom.findIndex(el=>{return el.objectId === element.objectId});
                        if(i === -1){
                            myRoom.push(element)
                        }else{
                            myRoom[i] = element;
                        }
                    });
                    context.commit('setMyRoom',myRoom);
                    resolve(myRoom)
                }).catch(err=>{
                    console.log(err);
                    resolve({code:1,msg:'请求失败'})
                })
            })
        },
        createRoom(context,room){
            return new Promise((resolve,reject)=>{
                util.httpAjax('data/insert','POST',{
                    collection:'test',
                    docName:'chatRoom'
                },room).then(res=>{
                    if(res.objectId){
                        let myRoom = context.state.myRoom;
                        let tempRoom = Object.assign(room,res)
                        myRoom.unshift(tempRoom);
                        context.commit('setMyRoom',myRoom);
                        resolve(myRoom)
                    }else{
                        alert(res)
                        resolve(res)
                    }
                }).catch(err=>{
                    console.log(err);
                    resolve({code:1,msg:'创建失败'})
                })
            })
        },
        joinRoom(context,roomId){
            return new Promise((resolve,reject)=>{
                if(!roomId){
                    resolve({code:1,msg:"加入失败"})
                }
                let me = context.rootState.user.userInfo;
                if(!me.myRoom){
                    me.myRoom = [];
                }
                if(me.myRoom.find(item=>{return item === roomId})){
                    resolve({code:1,msg:'已经加入了这个房间，不可重复加入'})
                }
                me.myRoom.push(roomId)
                let params = {
                    collection:'test',
                    docName:'user',
                    where:{
                        objectId:me.objectId
                    }
                };
                util.httpAjax('data/update','PUT',params,{myRoom:me.myRoom}).then(res=>{
                    context.commit('user/setUserInfo',me);
                    resolve(res)
                }).catch(err=>{
                    resolve({code:1,msg:"加入失败"})
                })
            })
        },
        quitRoom(context,roomId){

        },

        getMsgByRoomId(context,roomId){
            let params = {
                collection:'test',
                docName:'msgs',
                where:{
                    refRoom:roomId
                },
                sort:'-createAt',
                include:[{
                    from:'user',
                    as:'createUser',
                    localField:'createUser',
                    foreignField:'objectId'
                }]
            }
            return new Promise((resolve,reject)=>{
                util.httpAjax('/data/find','GET',params,{}).then(res=>{
                    console.log(res)
                    res.forEach(msg=>{
                        msg.createUser = msg.createUser[0]
                    });
                    let myRoom = context.state.myRoom;
                    let tempRoomIndex = myRoom.findIndex(item=>{
                        return item.objectId === roomId
                    })
                    myRoom[tempRoomIndex].msgs = res;
                    context.commit('setMyRoom',myRoom);
                    resolve(res);
                    // console.log(res)
                }).catch(err=>{
                    resolve({code:1,msg:'get data failed',err:err})
                })
            })
        },
        getConnection(context,val){
            return new Promise((resolve,reject)=>{
                let socket = io.connect(baseUrl,{
                    path:'/socket/socket.io'
                });
                context.commit('setCurrentIO',socket)

                socket.on('connect',()=>{
                    socket.emit('logIn',{room:val,name:context.rootState.user.userInfo.name})
                })

                socket.on('disconnect', (res)=>{
                    socket.emit('logOut',{room:val,name:context.rootState.user.userInfo.name})
                });

                socket.on('sc',data=>{
                    console.log('sc',data);
                    let myRoom = context.state.myRoom;
                    let i = myRoom.findIndex(item=>{
                        return val === item.objectId
                    });
                    myRoom[i].msgs.push(data);
                    context.commit('setMyRoom',myRoom);
                });
                resolve(socket);
            })
        },

        // msgItem:{
        //     objectId:'',     
        //     createUser:'',
        //     type:'',       需要传！
        //     refRoom:'',    需要传！
        //     content:'',    需要传！
        //     status:1,      
        //     createdAt:'',
        //     updateAt:''
        // },
        sendMsg(context,msgItem){
            let socket = context.state.currentIO,rootState = context.rootState;
            msgItem.createUser = rootState.user.userInfo.objectId;
            msgItem.status = 1;
            socket.emit('cs',{name:rootState.user.userInfo.name,msg:msgItem});
        }
    }
}


export default store