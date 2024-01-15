import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [mode === 'production' ? undefined : uni()],
    resolve: {
      alias: [
        {
          find: /@\//,
          replacement: pathResolve('src') + '/'
        },
        {
          find: /#\//,
          replacement: pathResolve('types') + '/'
        },
        {
          find: 'axios-uniapp',
          replacement: resolve(process.cwd(), './lib/axios.ts')
        }
      ]
    },
    server: {
      host: true,
      open: true,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:80',
          changeOrigin: true,
          rewrite: p => p.replace(/^\/api/, '')
        }
      }
    },
    build:
      mode === 'production'
        ? {
            rollupOptions: {
              external: [/node_modules/],
              output: {
                exports: 'default',
                globals: {
                  uni: 'uni'
                }
              }
            },
            lib: {
              entry: pathResolve('lib/axios.ts'),
              name: 'axiosUniapp',
              fileName: 'axios-uniapp',
              formats: ['es', 'umd']
            }
          }
        : undefined
  }
})
