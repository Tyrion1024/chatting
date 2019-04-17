<template>
    <div>
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
            
        }
    },
    created(){
        this.$store.dispatch('user/testUserToken').then(res=>{
            if(res.code!==0){
                this.$router.push('/unLogin');
            }else{
                // this.$store.dispatch('room/getMyRoom').then(res=>{
                //     console.log(res);
                //     return this.$store.dispatch('room/joinRoom','93155554242599610');
                // }).then(res=>{
                //     console.log(res);
                // })
            }
        })
    },
    methods:{

    },
    computed:{
        ...mapState('user',{
            userInfo:state=>state.userInfo
        })
    }
}
</script>
