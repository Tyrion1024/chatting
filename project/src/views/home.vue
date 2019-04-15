<template>
    
</template>

<script>
import {mapState} from 'vuex';
export default {
    data(){
        return {

        }
    },
    created(){
        console.log(this.$store.state);
        console.log(this.userInfo)
    },
    mounted(){
        this.$store.dispatch('user/testUserToken').then(res=>{
            if(res.code!==0){
                this.$router.push('/unLogin');
            }
        })
    },
    computed:{
        ...mapState('user',{
            userInfo:state=>state.userInfo
        })
        // ...mapState(['userInfo'])
    }
}
</script>

<style scoped>

</style>
