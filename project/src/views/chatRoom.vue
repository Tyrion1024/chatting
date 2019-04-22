<template>
    <div class="container">
        <div class="chatRoom_container">
            <div class="container_header">
                <div class="roomTitle" v-if="myRoom[currentRoomIndex]">{{myRoom[currentRoomIndex].title}}</div>
                <div class="userName">{{userInfo.name}}</div>
            </div>
            <div class="container_body" v-if="myRoom[currentRoomIndex]">
                <div class="body_container">
                    <div class="room_col">
                        <div :class="{'roomCard':true,'chooseRoomCard':currentRoomIndex == roomIndex }" v-for="(roomItem,roomIndex) in myRoom" :key="roomIndex">
                            <div class="roomTitle">
                                {{roomItem.title}}
                            </div>
                            <div class="roomDis">
                                {{roomItem.discription}}
                            </div>
                        </div>
                    </div>
                    <div class="room_container">
                        <div class="room_topArea">
                            <div class="msg_container" v-if="myRoom[currentRoomIndex].msgs">
                                <div class="msgItem" v-for="(msgItem,msgIndex) in myRoom[currentRoomIndex].msgs" :key="msgIndex">
                                    <div class="msg_box_user" v-if="msgItem.type==='user'">
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
                                <div class="sendMsg" @click="sendMSG">发送</div>
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
