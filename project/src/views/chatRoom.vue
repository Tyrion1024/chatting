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
          </div>-->
          <div class="room_container">
            <div class="room_topArea" v-loading="loading">
              <div class="msg_container" v-if="myRoom[currentRoomIndex].msgs">
                <div
                  :class="{'prompt_msg':(!msgItem.createUser),'msgItem':(msgItem.createUser&&msgItem.createUser.name!==userInfo.name),'msgItem_me':(msgItem.createUser&&msgItem.createUser.name===userInfo.name)}"
                  v-for="(msgItem,msgIndex) in myRoom[currentRoomIndex].msgs"
                  :key="msgIndex"
                >
                  <div
                    :class="{'msg_box_user':(msgItem.createUser.name!==userInfo.name),'msg_box_me':(msgItem.createUser.name===userInfo.name)}"
                    v-if="msgItem.type==='user'"
                  >
                    <div class="msg_info">
                      <div class="msg_createUser">{{msgItem.createUser.name}}</div>
                      <div class="msg_createTime">{{msgItem.createdAt}}</div>
                    </div>
                    <span class="msg_content">{{msgItem.content}}</span>
                  </div>
                  <div class="msg_box_system" v-if="msgItem.type === 'system'">
                    <div class="msg_content">{{msgItem.content}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="room_bottomArea">
              <div class="input_container">
                <textarea name id cols="30" class="inputArea" v-model="msgItem.content"></textarea>
              </div>
              <div class="btn_group">
                <el-button type="primary" @click="sendMSG" :disabled="!msgItem.content" round>发送</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="container_footer"></div> -->
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
    width:90%;
    height:95%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.container_header{
    padding: 5px 150px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
}
.container_body{
    flex-grow: 1;
    height:500px;
}
.body_container{
    display: flex;
    height:100%;
}
// .room_col{
//     width: 200px;
// }
.room_container{
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.room_topArea{
    height:80%;
    width:100%;
}

.msg_container{
    height:100%;
    width:80%;
    padding: 10px;
    background-color: #fafafa;
    overflow: auto;
    margin:0 auto;
    font-size: 12px;
    box-sizing: border-box;
    transition: all 10s;
}
.msgItem{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 15px 0;
}
.msgItem_me{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 15px 0;
}
.msg_box_user{
    text-align: left;
    .msg_info{
        display: flex;
        align-items: center;
        flex-direction: row;
        margin-bottom: 5px;
    }
    .msg_content{
        margin-left:10px;
        padding: 3px 5px;
        background-color: #e7e4e6ce;
        // background-color: #f1f1ef;
        border-radius: 10px;
        overflow: hidden;
    }
}
.msg_box_me{
    text-align: right;
    .msg_info{
        display: flex;
        align-items: center;
        flex-direction: row-reverse;
        margin-bottom: 5px;
    }
    .msg_content{
        margin-right:10px;
        padding: 3px 5px;
        background-color: #f1f1ef;
        // background-color: #e7e4e6ce;
        border-radius: 10px;
        overflow: hidden;
    }
}
.msg_box_system{
    display: flex;
    justify-content: center;
    align-items:center; 
    margin:10px auto;
    .msg_content{
        padding: 5px 15px;
        background-color: rgb(125, 255, 255);
        border-radius: 13px;
        overflow: hidden;
    }
}
.msg_createUser{
    margin:0 10px;
}
.msg_content{
    word-break: break-all;
}
.room_bottomArea{
    flex-grow: 1;
    width:100%;
    display: flex;
    flex-direction: column;
}
.input_container{
    font-size: 12px;
    flex-grow: 1;
    display: flex;
    padding: 0 10%; 
}

.inputArea{
    flex-grow: 1;
    width: 80%;
    padding: 5px;
    box-sizing: border-box;
    resize:none;
}
.btn_group{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0 5px;
}
.sendMsg{
    padding: 5px;
    box-sizing: border-box;
}
</style>


<script>
import { mapState } from "vuex";
import { setTimeout } from 'timers';
const util = require("../common/util.js");
export default {
  data() {
    return {
      currentRoomIndex: -1,
      msgItem: {
        content: "",
        refRoom: "",
        type: "user"
      },
      loading: true
    };
  },
  created() {
    document.title = '聊天室'
    this.$store.dispatch("user/testUserToken").then(res => {
      if (res.code !== 0) {
        this.$router.push("/unLogin");
      } else {
        this.getIntoRoom().then(res => {
          this.$store.dispatch("room/getConnection", res);
        });
      }
    });
  },
  methods: {
    getIntoRoom() {
      return new Promise((resolve, reject) => {
        this.$store.dispatch("room/getMyRoom").then(res => {
          console.log(res)
          if (res.length === 0) {
            this.$store
              .dispatch("room/joinRoom", "93155554242599610")
              .then(res => {
                return this.$store.dispatch("room/getMyRoom");
              })
              .then(res => {
                this.currentRoomIndex = 0;
                resolve("93155554242599610");
              });
          } else {
            // console.log(this.myRoom)
            this.currentRoomIndex = 0;
            resolve("93155554242599610");
          }
        });
      });
    },
    sendMSG() {
      this.msgItem.refRoom = this.myRoom[this.currentRoomIndex].objectId;
      this.$store.dispatch("room/sendMsg", this.msgItem).then(res => {
        this.initMsgItem();
      });
    },
    initMsgItem() {
      this.msgItem = {
        content: "",
        refRoom: "",
        type: "user"
      };
    }
  },
  computed: {
    ...mapState("user", {
      userInfo: state => state.userInfo
    }),
    ...mapState("room", {
      myRoom: state => {
        setTimeout(()=>{
          let scrollDiv = document.getElementsByClassName('msg_container')[0];
          if(scrollDiv){
            console.log(`${scrollDiv.scrollHeight}-${scrollDiv.scrollTop}=${scrollDiv.scrollHeight-scrollDiv.scrollTop}`);

          }
          if(scrollDiv&&scrollDiv.scrollHeight-scrollDiv.scrollTop<1000){
            scrollDiv.scrollTop = scrollDiv.scrollHeight;
          }
        },100)
        return state.myRoom
      }
    })
  },
  watch: {
    currentRoomIndex: {
      handler(n, o) {
        if (n !== o && n >= 0) {
          this.loading = true;
          this.$store.dispatch("room/getMsgByRoomId", this.myRoom[n].objectId).then(res => {
              this.loading = false;
              let scrollDiv = document.getElementsByClassName('msg_container')[0];
              scrollDiv.scrollTop = scrollDiv.scrollHeight;
          });
        }
      }
    }
  }
};
</script>
