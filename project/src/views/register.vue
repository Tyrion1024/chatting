<template>
    <div class="container">
        <div class="userName">
            userName：<input type="text" v-model="name" placeholder="please input username">
        </div>
        <div class="password">
            password：<input type="password" v-model="password">
        </div>
        <div class="btn_group">
            <button :disabled="!name||!password" @click="register" class="btn_register">注册</button>
            <router-link to='/login'>
                <button class="btn_register">去登录</button>
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
            password:'',
            name:''        
        }
    },
    created(){
        this.$store.dispatch('user/testUserToken').then(res=>{
            if(res.code==0){
                this.$router.push('/');
            }
        })
    },
    methods:{
        register(){
            this.$store.dispatch('user/register',{password:this.password,name:this.name}).then(res=>{
                if(res.code === 0){
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
