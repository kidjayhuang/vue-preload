import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];
export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs'
        },
        {
            file: pkg.module,
            format: 'esm'
        }
    ],
    plugins: [
        resolve({ extensions: [
            '.js', '.jsx', '.ts', '.tsx',
        ] }),

        babel({
            extensions,
            runtimeHelpers: true, // enabled Runtime helpers, support the transform-runtime plugin
            include: ['src/**/*'],
            exclude: ['node_modules'],
        }), 
        commonjs(),
        terser()
    ]
};