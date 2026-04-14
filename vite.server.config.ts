import { defineConfig } from 'vite'
import { builtinModules } from 'module'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/backend/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
      entryFileNames: 'index.js',
    },
    rollupOptions: {
      external: [
        ...builtinModules,
        'express',
        'cors',
        'helmet',
        'morgan',
        'dotenv',
        'pg',
        'jsonwebtoken',
        'bcryptjs',
        'uuid',
        'socket.io',
      ],
      },
    },
    outDir: 'dist-backend',
    emptyOutDir: true,
    minify: false,
    sourcemap: false,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})