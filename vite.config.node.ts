import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  
  plugins: [dts({ rollupTypes: true })],
  build: {
    minify: false,
    sourcemap: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/lib.ts'),
      name: 'SimplePageFlip',
      // the proper extensions will be added
      fileName: 'simple-page-flip',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['gl-matrix'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          ['gl-matrix']: 'glMatrix',
        },
      },
      
    },
  },
})
