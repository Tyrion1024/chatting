<template>
    <div class="container">
        <div class="chatRoom_container">
            <div class="container_header">
                <div class="roomTitle" v-if="myRoom[currentRoomIndex]">{{myRoom[currentRoomIndex].title}}</div>
                <div class="userName">{{userInfo.name}}</div>
            </div>
            <div class="container_body">
                <div class="body_container">
                    <div class="room_col">
                        <!-- currentRoomIndex == roomIndex -->
                        <div :class="{'roomCard':true,'chooseRoomCard':false}" v-for="(roomItem,roomIndex) in myRoom" :key="roomIndex">
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
                            <div class="msg_container" v-if="myRoom[currentRoomIndex]">
                                <div class="msgItem" v-for="(msgItem,msgIndex) in myRoom[currentRoomIndex].msgs" :key="msgIndex">
                                    <div class="msg_info">
                                        <div class="msg_createUser">
                                            {{msgItem.createUser[0].name}}
                                        </div>
                                        <div class="msg_createTime">
                                            {{msgItem.createdAt}}
                                        </div>
                                    </div>
                                    <div class="msg_content">
                                        {{msgItem.content}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="room_bottomArea">
                            <div class="input_container">
                                <textarea name="" id="" cols="30" class="inputArea" rows="10"></textarea>
                            </div>
                            <div class="btn_group">
                                <div class="sendMsg">发送</div>
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
import { Promise, reject } from 'q';
const util = require('../common/util.js')
export default {
    data(){
        return {
            currentRoomIndex:-1
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
                            this.currentRoomIndex = 0;
                            resolve('93155554242599610')
                        })
                    }else{
                        this.currentRoomIndex = 0;
                        resolve('93155554242599610')
                    }
                })
            })
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
                if(n!==o&&n>0){
                    this.$store.dispatch('room/getMsgByRoomId',this.myRoom[n].objectId)
                }
            }
        }
    }
}
</script>
