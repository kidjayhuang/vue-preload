module.exports = {
    presets: [
        ['@babel/preset-env'],
        '@babel/preset-typescript',
    ],
    plugins: [
        [
            /* 
                useBuiltIns跟transform-runtime都是处理polyfill的，
                如果transform-runtime配置了corejs:3，useBuiltIns基本就不会生效(可以理解为同一功能被覆盖)

                useBuiltIns是全局引入，会污染全局环境 e.g. import 'core-js/modules/es.promise.js';
                但是这样不保证引用的项目,会包含core-js这个包，所以需要npm install --save core-js@3保证有corejs代码

                transform-runtime是直接复制polyfill代码引入，不会污染全局环境，只是包会很大，
                至于去哪里复制呢？这时候就需要@babel/runtime-corejs3，这个包涵盖了core-js跟regenerator-runtime
                还有一些helper函数。跟@babel/polyfill是一个东西，所以为什么会覆盖useBuiltIns估计就是这样来的。

                发现rollup.config.js不配置resolve.extensions的时候打包出来的代码是下面这样，
                import _Promise from '@babel/runtime-corejs3/core-js-stable/promise';
                而不是直接复制polyfill代码，目前还没搞懂
            */
            '@babel/plugin-transform-runtime',
            {
                'corejs': 3
            }
        ]
    ]
};