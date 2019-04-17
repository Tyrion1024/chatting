import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import user from './user.module.js';
import room from './room.module.js'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
 
  },
  mutations: {

  },
  actions: {

  },
  modules:{
    user,
    room
  }
})


export default store
