<template>
    <div class="container">
        <div class="chatRoom_container">
            <div class="container_header" v-if="myRoom[currentRoomIndex]">
                <div class="userName">当前用户：{{userInfo.name}}</div>
                <div class="roomTitle">房间：{{myRoom[currentRoomIndex].title}}</div>
                <div class="userName">创建者：{{myRoom[currentRoomIndex].createUser[0].name}}</div>
            </div>
            <div class="container_body" v-if="myRoom[currentRoomIndex]">
                <div class="body_container">
                    <!-- <div class="room_col">
                        <div :class="{'roomCard':true,'chooseRoomCard':currentRoomIndex == roomIndex }" v-for="(roomItem,roomIndex) in myRoom" :key="roomIndex">
                            <div class="roomTitle">
                                {{roomItem.title}}
                            </div>
                            <div class="roomDis">
                                {{roomItem.discription}}
                            </div>
                        </div>
                    </div> -->
                    <div class="room_container">
                        <div class="room_topArea">
                            <div class="msg_container" v-if="myRoom[currentRoomIndex].msgs">
                                <div :class="{'prompt_msg':(!msgItem.createUser),'msgItem':(msgItem.createUser&&msgItem.createUser.name!==userInfo.name),'msgItem_me':(msgItem.createUser&&msgItem.createUser.name===userInfo.name)}" v-for="(msgItem,msgIndex) in myRoom[currentRoomIndex].msgs" :key="msgIndex">
                                    <div :class="{'msg_box_user':(msgItem.createUser.name!==userInfo.name),'msg_box_me':(msgItem.createUser.name===userInfo.name)}" v-if="msgItem.type==='user'">
                                        <div class="msg_info">
                                            <div class="msg_createUser">
                                                {{msgItem.createUser.name}}
                                            </div>
                                            <div class="msg_createTime">
                                                {{msgItem.createdAt}}
                                            </div>
                                        </div>
                                        <div class="msg_content">
                                            {{msgItem.content}}
                                        </div>
                                    </div>
                                    <div class="msg_box_system" v-if="msgItem.type === 'system'">
                                        {{msgItem.content}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="room_bottomArea">
                            <div class="input_container">
                                <textarea name="" id="" cols="30" class="inputArea" rows="10" v-model="msgItem.content"></textarea>
                            </div>
                            <div class="btn_group">
                                <el-button type="primary" @click="sendMSG" :disabled="!msgItem.content" round>发送</el-button>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
            <div class="container_footer"></div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.container{
    width:100vw;
    height:100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.chatRoom_container{
    width:80%;
    height:95%;
    overflow: hidden;
}
.container_header{
    padding: 5px 100px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
}
.body_container{
    display: flex;
}
.room_container{
    flex-grow: 1;

}
.msg_container{
    height:180px;
    width:70%;
    padding: 10px;
    background-color: #fafafa;
    overflow: auto;
    margin:0 auto;
    font-size: 12px;
}
.msgItem{
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
.msgItem_me{
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
// .msg_box_user .msg_info{
//     display: flex;
//     align-items: center;
// }
// .msg_box_me .msg_info{
//     display: flex;
//     align-items: center;
//     justify-content: flex-end;
// }
.input_container{
    height: 72px;
    font-size: 12px;
}

.inputArea{
    width: 70%;
    padding: 10px;
    height:50px;
    resize:none;
}
.btn_group{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 0;
}
.sendMsg{
    padding: 5px;
}
</style>


<script>
import {mapState} from 'vuex'
const util = require('../common/util.js')
export default {
    data(){
        return {
            currentRoomIndex:-1,
            msgItem:{
                content:'',
                refRoom:'',
                type:'user'
            }
        }
    },
    created(){
        this.$store.dispatch('user/testUserToken').then(res=>{
            if(res.code!==0){
                this.$router.push('/unLogin');
            }else{
                this.getIntoRoom().then(res=>{
                    this.$store.dispatch('room/getConnection',res);
                })
            }
        })
    },
    methods:{
        getIntoRoom(){
            return new Promise((resolve,reject)=>{
                this.$store.dispatch('room/getMyRoom').then(res=>{
                    if(res.length === 0){
                        this.$store.dispatch('room/joinRoom','93155554242599610').then(res=>{
                            return this.$store.dispatch('room/getMyRoom')
                        }).then(res=>{
                            this.currentRoomIndex = 0;
                            resolve('93155554242599610')
                        })
                    }else{
                        // console.log(this.myRoom)
                        this.currentRoomIndex = 0;
                        resolve('93155554242599610')
                    }
                })
            })
        },
        sendMSG(){
            this.msgItem.refRoom = this.myRoom[this.currentRoomIndex].objectId;
            this.$store.dispatch('room/sendMsg',this.msgItem)
        }
    },
    computed:{
        ...mapState('user',{
            userInfo:state=>state.userInfo
        }),
        ...mapState('room',{
            myRoom:state=>state.myRoom
        })
    },
    watch:{
        currentRoomIndex:{
            handler(n,o){
                if(n!==o&&n>=0){
                    this.$store.dispatch('room/getMsgByRoomId',this.myRoom[n].objectId)
                }
            }
        }
    }
}
</script>
