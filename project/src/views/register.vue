<template>
    <div class="container">
        <div class="userName">
            <el-input placeholder="please type userName"
                v-model="name"
                :minlength="1"
                :maxlength="10"
                clearable>
            </el-input>
        </div>
        <div class="password">
            <el-input placeholder="please type password" v-model="password" :minlength="6" :maxlength="15" show-password></el-input>
        </div>
        <div class="btn_group">
            <el-button :disabled="name.length>10||name.length == 0||password.length<6||password.length>15" @click="register" class="btn_register" type="primary">注册</el-button>
            <el-button class="btn_register" @click="goLogin">去登录</el-button>
        </div>
    </div>
</template>

<style scoped>
    .container{
        width:40%;
        margin:300px auto 0;
    }
    @media screen and (max-width: 750px) {
        .container{
            width:70%;
            margin:500px auto 0;
        }
    }

    .container div{
        margin-top:10px;
    }
    .container .btn_group{
        display: flex;
        justify-content: center;
        margin-top:60px;
    }
    .el-button{
        margin-right:15px;
    }
</style>

<script>
import {mapState} from 'vuex'
const util = require('../common/util.js')
export default {
    data(){
        return {
            password:'',
            name:''        
        }
    },
    created(){
        document.title = '注册'
        this.$store.dispatch('user/testUserToken').then(res=>{
            if(res.code==0){
                this.$router.push('/');
            }
        })
    },
    methods:{
        register(){
            if(this.name.includes(' ')||this.password.includes(' ')){
                this.$alert('用户名和密码中不可含有空格喔', '提示', {
                    confirmButtonText: '我知道啦',
                    callback: action => {

                    }
                });
                return 
            }
            this.$store.dispatch('user/register',{password:this.password,name:this.name}).then(res=>{
                if(res.code === 0){
                    this.$notify({
                        title: '提示',
                        message: '注册成功',
                        type: 'success',
                        duration:1500,
                        onClose(){
                            this.$router.push('/');
                        }
                    });
                }else{
                    this.$alert(res.msg, '提示', {
                        confirmButtonText: '确定',
                        callback: action => {

                        }
                    });
                }
            })
        },
        goLogin(){
            this.$router.push('/login');
        }
    },
    computed:{
        
    }
}
</script>
