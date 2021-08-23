import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
// import router from './router/index';
import * as localstorageUtil from './utils/localstorage';
import VueRouter from 'vue-router'
import axios from 'axios';

Vue.use(VueRouter);

Vue.config.productionTip = false
Vue.prototype.$http = axios;


import Login from './components/Login';
import Register from './components/Register';
import HelloWorld from './components/HelloWorld';
import Exception403 from './components/Exception403';
import Home from './components/Home';
import Editor from './components/Editor';

const routes = [
  { path: '', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/home', name: 'home', component: Home },
  { path: '/exception-403', name: 'exception-403', component: Exception403 },
  { path: '/hello', name: 'hello', component: HelloWorld },
  { path: '/editor/:userId', name: 'editor', component: Editor },

]
const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    if (!localstorageUtil.getItem('token')) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath },
      });
    }
   else {
      next();
    }
  } else {
    next();
  }
});

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>',
//   vuetify,
// });
