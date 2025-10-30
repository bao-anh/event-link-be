import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entryPoint = path.resolve(__dirname, 'src/lambda.js');
const outfile = path.resolve(__dirname, 'dist/lambda.js');

await build({
  entryPoints: [entryPoint],
  outfile,
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  sourcemap: true,
  minify: false,
  external: ['aws-sdk'],
  tsconfig: path.resolve(__dirname, 'tsconfig.json'),
  logLevel: 'info',
});
