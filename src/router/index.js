import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const Login = () => import('../components/Login');
// const Exception403 = () => import('../components/Exception403');
// const HelloWorld = () => import('../components/HelloWorld');

let router = new Router({
  mode: 'history',
  routes: [
    { path: '/login', name: 'login', component: Login, meta: { guest: true } },
    // { path: '', name: '', component: HelloWorld, meta: { auth: true },
    //   children: [
    //     { path: '', redirect: 'hello-world' },
    //     { path: 'exception-403', name: 'exception-403', component: Exception403 },
    //   ],
    // },
  ],
});

export default router;
