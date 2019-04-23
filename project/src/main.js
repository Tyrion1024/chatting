import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '../store/store'
import 'amfe-flexible'
import ElementUI from 'ElementUI';

// console.log('element',ElementUI)
Vue.use(ElementUI);
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
