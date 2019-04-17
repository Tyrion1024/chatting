<template>
    <div class="container">
        <div class="userName">
            userName：<input type="text" v-model="name" placeholder="please input userName">
        </div>
        <div class="password">
            password：<input type="password" v-model="password">
        </div>
        <div class="btn_group">
            <button :disabled="!name||!password" @click="login" class="btn_submit">登录</button>
            <router-link to='/register'>
                <button class="btn_register">去注册</button>
            </router-link>
        </div>
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
            this.$store.dispatch('user/login',{name:this.name,password:this.password}).then(res=>{
                if(res.code==0){
                    this.$router.push('/');
                }else{
                    alert(res.msg)
                }
            })
        }
    },
    computed:{

    }
}
</script>
