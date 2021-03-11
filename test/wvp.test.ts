import wvp from '../src/index';
import VueRouter, { ComponentOptions } from 'vue-router';
import Vue, { PluginObject, AsyncComponent } from 'vue'

describe('wvp init', () => {
    test('init', () => {
        Vue.use(wvp);
    });

    test('router-preload', () => {
        Vue.use(wvp);
        Vue.use(VueRouter);


        
        const Home = { template: '<div>This is Home</div>' };
        const Foo = { template: '<div>This is Foo</div>' };
        const Bar = { template: '<div>This is Bar <router-view></router-view></div>' };
        const Baz = { template: '<div>This is Baz</div>' };
        const router = new VueRouter({
            mode: 'history',
            routes: [
                {
                    name: 'home',
                    path: '/home',
                    preload: 'foo',
                    component: { template: Home },
                },
                {
                    name: 'foo',
                    path: '/foo',
                    component: { template: Foo },
                },
                {
                    name: 'bar',
                    path: '/bar',
                    component: { template: Bar },
                }
              ]
        });
        const app = new Vue({
            router,
            render (h) { return h('div'); }
        });
        console.log(111, app);
    });

});