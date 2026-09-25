import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const port = process.env.PORT || '3000';
const nextEntry = fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url));
const nextProcess = spawn(process.execPath, [nextEntry, 'start', '-p', port], {
  stdio: 'inherit',
  shell: false,
});

nextProcess.on('error', (error) => {
  console.error(`Unable to start Next.js: ${error.message}`);
  process.exit(1);
});

nextProcess.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 1);
  }
});