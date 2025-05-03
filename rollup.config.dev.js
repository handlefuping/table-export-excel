import typescript from '@rollup/plugin-typescript'
import serve from 'rollup-plugin-serve'
import copy from 'rollup-plugin-copy-assets'

export default {
    input: './main.ts',
    external: ['exceljs'],
    output: {
        file: 'dist/main.js',
        name: 'main',
        format: 'module',
        paths: {
            exceljs: 'https://cdn.jsdelivr.net/npm/exceljs@4.4.0/+esm',
        },
    },
    watch: {
        include: ['./main.ts', 'internal/**'],
    },
    plugins: [
        typescript({
            tsconfig: './tsconfig.json',
        }),
        copy({
            assets: ['./index.html'],
        }),
        serve({
            port: 3000,
            contentBase: 'dist',
        }),
    ],
}
