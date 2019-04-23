<template>
    <div class="container">
        <div class="userName">
            <!-- userName：<input type="text" v-model="name" placeholder="please type userName"> -->
            <el-input placeholder="please type userName"
                v-model="name"
                :minlength="1"
                :maxlength="10"
                clearable>
            </el-input>
        </div>
        <div class="password">
            <!-- password：<input type="password" v-model="password"> -->
            <el-input placeholder="please type password" v-model="password" :minlength="6" :maxlength="15" show-password></el-input>
        </div>
        <div class="btn_group">
            <el-button :disabled="name.length>10||name.length == 0||password.length<6||password.length>15" @click="login" class="btn_submit" type="primary">登录</el-button>
            <!-- <button :disabled="!name||!password" @click="login" class="btn_submit">登录</button> -->
            <router-link to='/register'>
                <!-- <button class="btn_register">去注册</button> -->
                <el-button class="btn_register">去注册</el-button>
            </router-link>
        </div>
    </div>
</template>

<style scoped>
    .container{
        width:200px;
        margin:100px auto;
    }
    .container div{
        margin-top:5px;
    }
    .btn_group{
        display: flex;
        justify-content: center;
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
            name:'',
            password:''
        }
    },
    created(){
        this.$store.dispatch('user/testUserToken').then(res=>{
            if(res.code==0){
                this.$router.push('/');
            }
        });
    },
    methods:{
        login(){
            if(this.name.includes(' ')||this.password.includes(' ')){
                this.$alert('用户名和密码中不可含有空格喔', '提示', {
                    confirmButtonText: '我知道啦',
                    callback: action => {

                    }
                });
                return 
            }
            this.$store.dispatch('user/login',{name:this.name,password:this.password}).then(res=>{
                if(res.code==0){
                    this.$notify({
                        title: '提示',
                        message: '登陆成功',
                        type: 'success',
                        duration:1500,
                        onClose: () => {
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
        }
    },
    computed:{

    }
}
</script>
