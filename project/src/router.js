import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login.vue'
import chatRoom from './views/chatRoom.vue'
import register from './views/register.vue'
import Home from './views/home.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path:'/',
      name:'home',
      component:Home
    },
    {
      path: '/chatRoom',
      name: 'chatRoom',
      component: chatRoom
    },
    {
      path:'/login',
      name:'login',
      component:Login
    },
    {
      path:'/register',
      name:'register',
      component:register
    },
    {
      path:'/',
      redirect:'/home'
    },
    {
      path:'/unLogin',
      redirect:'/login'
    }
  ]
})
