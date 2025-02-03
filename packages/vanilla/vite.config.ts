import path from 'node:path';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import {viteEnvs} from 'vite-envs'
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

export default defineConfig({
    plugins: [
        react(),
        wasm(),
        topLevelAwait(),
        viteEnvs({
            declarationFile: ".env.example"
        })

    ],
    resolve: {
        alias: {
            "@pixelaw/core": path.resolve(__dirname, '../core/src'),
            "@pixelaw/core-dojo": path.resolve(__dirname, "../core-dojo/src"),
            "@pixelaw/react-dojo": path.resolve(__dirname, "../react-dojo/src"),
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        sourcemap: true,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'), // Ensure index.html is included
            },
            external: ['src/scripts/**']
        }
    },
    server: {
        fs: {
            allow: [
                path.resolve(__dirname, '../core-dojo/dist'),
                path.resolve(__dirname, '../core-dojo/src'),
                path.resolve(__dirname, './'),
            ],
        },
    },
});

