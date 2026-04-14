#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const targetDir = join(__dirname, '../dist');

console.log('Iniciando Icon Generator...');
console.log('Servidor levantado. Presiona Ctrl+C para salir.');

try {
  // Uses npx to run a simple server on the pre-built dist output
  execSync(`npx serve -s ${targetDir}`, { stdio: 'inherit' });
} catch (error) {
  console.error("Error al iniciar el servidor local para Icon Generator.", error);
  process.exit(1);
}
