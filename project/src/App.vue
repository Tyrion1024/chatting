<template>
  <div id="app">
    <!-- <button @click="getConnection('one')">打开链接</button> -->
    <router-view/>
  </div>
</template>

<script>
import io from 'socket.io-client';
export default {
  data(){
    return{

    }
  },
  created(){

  }
}
</script>


<style lang="less">
*{
  margin:0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
