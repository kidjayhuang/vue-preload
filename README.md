# @kidjay/vue-preload

基于vue-router & dynamic import的页面预加载器


## 版本

v0.0.1


## 安装

``` bash
npm install @wesure/ws-vue-preload
```
## 背景
路由组件使用动态import，webpack会将单页面组件分成多个包，在执行路由跳转前才去加载资源，下载完才会跳转，这个包的
作用是能在当前页面任何时机下载其它页面的包，达到预加载的效果，通俗地说就是牺牲当前页性能，提升后续页面性能，所以
调用时机要选好~~

## 使用

#### 前置条件
注意routes一定要加name属性，且preload的字段名要跟name属性一致，路由组件是使用动态import的方式引入，而不是同步引入



#### 引入
``` js
import wsVuePreload from '@wesure/ws-vue-preload';

Vue.use(wsVuePreload);
```

使用方式一. 配置路由meta.preload属性，以下配置表示在home页会预加载large页的代码包
```js
 {
    name: 'home',
    path: '/home',
    meta: {
        preload: 'large'
    },
    component: () => import(/* webpackChunkName: "home" */ '@/pages/home/index.vue'),
},
```

使用方式二.自定义时机执行 this.$preload('large')
```js
methods: {
    preload() {
        this.$preload('large')
    }
},
```


