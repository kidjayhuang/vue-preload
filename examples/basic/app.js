import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import WsVuePreload from 'ws-vue-preload';
// import Foo from './components/foo.vue';
// import Bar from './components/bar.vue';

Vue.use(WsVuePreload);
Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'history',
  base: '/basic',
  routes: [
    { 
      name: 'home', 
      path: '/home', 
      meta: {
        preload: 'large'
      },
      component: ()=> import(/* webpackChunkName: "home" */ './components/home.vue') 
    },
    { 
      name: 'foo', 
      path: '/foo', 
      // component: Foo
      component: ()=> import(/* webpackChunkName: "foo" */ './components/foo.vue') 
    },
    { name: 'bar',  
      path: '/bar', 
      // component: Bar,
      component: ()=> import(/* webpackChunkName: "bar" */ './components/bar.vue') 
    },
    { 
      name: 'baz', 
      path: '/baz', 
      component: ()=> import(/* webpackChunkName: "baz" */ './components/baz.vue') 
    },
    { name: 'large',  
      path: '/large', 
      component: ()=> import(/* webpackChunkName: "large" */ './components/large.vue') 
    },
    { path: '*', redirect: '/home' }, // 未命中路由时跳转到首页
  ]
});

new Vue({
  el: '#app',
  router,
  template: '<App />',
  components: { App },

  // render: h => h(App)
});
