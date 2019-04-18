<template>
    <div class="chatRoom_container">
        <div class="header">
            <div class="roomTitle" v-if="myRoom[currentRoomIndex]">{{myRoom[currentRoomIndex].title}}</div>
        </div>
        <div class="body">
            <div class="body_container">
                <div class="room_col">
                    <div class="roomCard" v-for="(roomItem,roomIndex) in myRoom" :key="roomIndex">
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
                        <div class="msg_container">
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
                            <textarea name="" id="" cols="30" rows="10"></textarea>
                        </div>
                        <div class="btn_group">
                            <div class="clearInput">清除</div>
                            <div class="sendMsg">发送</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer"></div>
    </div>
</template>

<style scoped>

</style>

<script>
import {mapState} from 'vuex'
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
                this.$store.dispatch('room/getMyRoom').then(res=>{
                    // console.log(res);
                    if(res.length === 0){
                        this.$store.dispatch('room/joinRoom','93155554242599610').then(res=>{
                            this.currentRoomIndex = 0;
                        })
                    }else{
                        this.currentRoomIndex = 0;
                    }
                })
            }
        })
    },
    methods:{

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
                if(n!==o$$n>0){
                    this.$store.dispatch('room/getMsgByRoomId',this.myRoom[n].objectId)
                }
            }
        }
    }
}
</script>
