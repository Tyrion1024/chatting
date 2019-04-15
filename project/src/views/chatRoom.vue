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
