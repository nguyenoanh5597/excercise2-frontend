import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import * as localstorageUtil from './utils/localstorage';
import VueRouter from 'vue-router'
import axios from 'axios';
import Toasted from 'vue-toasted';
import VueQuillEditor from 'vue-quill-editor'

import Login from './components/Login';
import Register from './components/Register';
import HelloWorld from './components/HelloWorld';
import Exception403 from './components/Exception403';
import Home from './components/Home';
import Editor from './components/editor/Editor';

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueRouter);
Vue.use(VueQuillEditor)
Vue.use(Toasted, { duration: 5000, keepOnHover: true, position: 'bottom-right', type: 'success' });

Vue.config.productionTip = false
Vue.prototype.$http = axios;




const routes = [
  { path: '', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/home', name: 'home', component: Home },
  { path: '/exception-403', name: 'exception-403', component: Exception403 },
  { path: '/hello', name: 'hello', component: HelloWorld },
  { path: '/editor/:id', name: 'editor', component: Editor },

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


