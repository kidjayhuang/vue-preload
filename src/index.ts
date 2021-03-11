
import { VueConstructor } from 'vue';
import VueRouter from 'vue-router';

let timer: number;
let _Vue: VueConstructor; // bind on install
// let _watcherVM;
let router: VueRouter;
function assert (condition: any, msg: string): void {
    if (!condition) { throw new Error(("[vue-preload] " + msg)); }
}

function warn (msg: string): void {
    console.warn("[vue-preload] " + msg);
}

function log (msg: any): void {
    console.log("[vue-preload] ", msg);
}

function _toRawType (value: any): string {
    return Object.prototype.toString.call(value).slice(8, -1);
}

function isObject (obj: any): boolean {
    return obj !== null && typeof obj === 'object';
}

function isDef (v: any): boolean { return v !== undefined; }

function forInValue (obj: {[key: string]: any}, fn: Function) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn(obj[key], key);
        }
    }
}

// function forEachValue (obj: {[key: string]: any}, fn: Function) {
//     Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
// }
// function isNative (Ctor: any): boolean {
//     return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
// }
  
function install (Vue: VueConstructor): void {
    if (_Vue && Vue === _Vue) {
        if ((process.env.NODE_ENV !== 'production')) {
            console.error(
                '[vue-preload] already installed. Vue.use(VuePreload) should be called only once.'
            );
        }
        return;
    }
    _Vue = Vue;
    // _watcherVM = new _Vue(); // 生成vm实例用于监听

    applyMixin(_Vue);

    Object.defineProperty(Vue.prototype, '$preload', {
        value: function (preload: string|string[], callback: Function): void {
            if(typeof preload === 'string') {
                preload = [preload];
            }
            if(Array.isArray(preload)) {
                _preloader({ routes: preload, callback });
                return;
            }
            assert(false, 'expects string or array as the $preload, but found ' + _toRawType(preload) + '.');

        }
    });
}
function applyMixin(_Vue: VueConstructor): void {
    _Vue.mixin({ 
        beforeCreate: wvpInit
    });
}

function wvpInit (): void {
    const options = this.$options;

    if (options.router) { // 获取实例参数，只有vm的参数有router属性
        router = options.router;
        assert(isDef(router), 'new Vue构造函数需要传入router属性');
        router.afterEach((to) => {
            clearTimeout(timer); // 有可能存在跳走了还没预加载的情况，清除定时器
            let { preload } = to.meta;
            if(preload) {
                if(typeof preload === 'string') {
                    preload = [preload];
                }
                if(Array.isArray(preload)) {
                    _preloader({ routes: preload });
                    return;
                }

                if(isObject(preload)) {
                    let { routes, delay, callback } = preload;
                    if(typeof routes === 'string') {
                        routes = [routes];
                    }
                    if(Array.isArray(routes)) {
                        _preloader({ routes, delay, callback });
                        return;
                    }
                    assert(false, 'expects string or array as the routes, but found ' + _toRawType(routes) + '.');
                }

                assert(false, 'expects string or array or object as the preload, but found ' + _toRawType(preload) + '.');
            }
        });
    }
}

const seenRoutes = new Set(); // 缓存已预加载的路由


type _preloaderOpts = { routes: string[], delay?: number, callback?: Function }


function _preloader({ routes=[], delay=0, callback }: _preloaderOpts = {routes:[]}): void {
    const preloadRoutes: any[] = [];

    routes.forEach((preloadRoute)=>{
        if (seenRoutes.has(preloadRoute)) {
            warn(`${preloadRoute}模块已经加载过了`);
            return;
        } // 如果已经预加载过，则不再处理
     
        const matchRoute: any = router.options.routes && router.options.routes.find((route)=>{
            return preloadRoute === route.name;
        });

        assert(isDef(matchRoute), `预加载路由${preloadRoute}需要在routes里添加同名的name属性`); // 没写name属性，直接报错，后面不执行了
        seenRoutes.add(preloadRoute);
        preloadRoutes.push(matchRoute); 
    });
    if (preloadRoutes.length) {

        timer = window.setTimeout(()=>{
            const asyncQueue: any[] = [];
            preloadRoutes.forEach((route)=>{
                // component调用过一次之后会自动新增一个resolved属性（相当于缓存了），下次调用直接就resolve了
                if(route.component && route.component.name === 'component') { // route.component.name === 'component'是为了检测组件是动态import进来的，不然执行同步import的组件函数会报错
                    asyncQueue.push(route.component());
                } else if(route.components) { // 命名视图，用得较少 https://router.vuejs.org/zh/guide/essentials/named-views.html#%E5%B5%8C%E5%A5%97%E5%91%BD%E5%90%8D%E8%A7%86%E5%9B%BE
                    forInValue(route.components, (component: any)=>{
                        asyncQueue.push(component());
                    });
                }
            });

            Promise.allSettled(asyncQueue).then((res)=>{
                log(res);
                if(typeof callback === 'function') callback(res);
            });
       
        }, delay);
    }
}

export default install;
