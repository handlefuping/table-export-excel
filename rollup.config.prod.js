import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'

export default {
    input: './main.ts',
    external: ['exceljs'],
    output: [
        {
            file: pkg.module,
            format: 'module',
        },
        {
            file: pkg.main,
            format: 'cjs',
            exports: 'named',
        },
    ],
    plugins: [
        typescript({
            tsconfig: './tsconfig.json',
        }),
    ],
}
