/* eslint-env-node */

import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const hasName = process.argv.indexOf('--name') + 1 || process.argv.indexOf('-n') + 1;
const name = hasName ? process.argv[hasName] : 'no-name';
const fileName = name.replace(/([A-Z])/g, (m, s) => `-${s.toLowerCase()}`);

const hasFormat = process.argv.indexOf('--output.format') + 1 || process.argv.indexOf('-f') + 1;
const format = hasFormat ? process.argv[hasFormat] : 'umd';

const config = {
  input: `src/${fileName}.js`,
  output: {
    name,
    file: `dist/${fileName}.js`,
    format,
    banner: format === 'cjs' ? '#!/usr/bin/env node' : '',
  },
  plugins: [
    resolve({ jsnext: true, preferBuiltins: false }),
    babel({
      exclude: 'node_modules/**',
      presets: [['es2015', { modules: false }]],
      plugins: ['external-helpers'],
      babelrc: false,
    }),
    commonjs(),
    filesize(),
  ],
};

export default config;
