import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  //react() enables React support.
  //dts() generates TypeScript declaration files (*.d.ts)
  //during the build.
  plugins: [react(), tsconfigPaths(), dts()],
  build: {
    //Specifies that the output of the build will be a library.
    lib: {
      // Defines the entry point for the library build. It resolves
      // to src/index.ts,indicating that the library starts from this file.
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'react-hook-modal',
      // A function that generates the output file
      // name for different formats during the build
      fileName: (format) => `react-hook-modal.${format}.js`,
    },
    rollupOptions: {
      // 라이브러리에 포함하지 않을 외부 의존성을 설정합니다.
      external: ['react', 'react-dom'],
      output: {
        // 라이브러리 외부에 존재하는 의존성을 위해
        // UMD(Universal Module Definition) 번들링 시 사용될 전역 변수를 명시할 수도 있습니다.
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    // Generates sourcemaps for the built files,
    // aiding in debugging.
    sourcemap: true,
    //Clears the output directory before building.
    emptyOutDir: true,
  },
});
