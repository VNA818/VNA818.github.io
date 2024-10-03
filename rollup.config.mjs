import css from "rollup-plugin-import-css";
import cleanup from 'rollup-plugin-cleanup';
import terser from '@rollup/plugin-terser';
import strip from '@rollup/plugin-strip';
import convertImagesPlugin from './image-convert.mjs';
import replace from '@rollup/plugin-replace';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import 'dotenv/config';

export default {
    input: "main.js",
    output: {
      dir: "dist",
      format: "iife"
    },
    plugins: [
      css({ minify: true }),
      cleanup(),
      terser(),
      strip(),
      convertImagesPlugin(),
      {
        generateBundle(options, bundle) {
          for (const file of Object.keys(bundle)) {
            //console.log(bundle[file], bundle[file].type)
            if (bundle[file].name === 'index.html') {
              bundle[file].source = bundle[file].source.replace("https://count.getloli.com/get/@test?theme=moebooru", process.env.VISIT_COUNTER);
            }
          }
        },
      }
    ]
};