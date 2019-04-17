const util = require('../src/common/util.js')

const store = {
    namespaced:true,
    state: {
        myRoom:[]
    },
    mutations: {
        setMyRoom(state,arr){
            state.myRoom = util.deepClone(arr)
        }
    },
    actions: {
        getMyRoom(context,room){

        },
        createRoom(context,room){
            util.httpAjax('data/insert','POST',{
                collection:'test',
                docName:'room'
            },room).then(res=>{
                if(res.objectId){
                    let myRoom = context.state.myRoom;
                    let tempRoom = Object.assign(room,res)
                    myRoom.unshift(tempRoom);
                    context.commit('setMyRoom',myRoom);
                }else{
                    alert(res)
                }
            })
        },
        joinRoom(context,room){

        },
        quitRoom(context,room){

        }
    }
}


export default store