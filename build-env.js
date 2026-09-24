/* Reads .env and writes env.js (window.ENV), which the website loads.
   firebase-config.js then builds window.FIREBASE_CONFIG from window.ENV.
   Run:  node build-env.js
   Note: a browser can never keep these values secret. They are public-by-design keys;
   your Firestore rules protect the data. Never put a password in .env. */
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('No .env file found. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const env = {};
fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach(function (line) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (!m) return;
  env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
});

if (!env.FIREBASE_API_KEY || !env.FIREBASE_PROJECT_ID) {
  console.warn('Warning: FIREBASE_API_KEY / FIREBASE_PROJECT_ID missing in .env, the site will run in demo mode.');
}

const header = '/* GENERATED from .env by build-env.js. Do not edit here: change .env and run  node build-env.js */\n';
fs.writeFileSync(path.join(__dirname, 'env.js'), header + 'window.ENV = ' + JSON.stringify(env, null, 2) + ';\n');

console.log('Wrote env.js from .env' + (env.WEB3FORMS_KEY ? '' : ' (email is off: WEB3FORMS_KEY is empty)'));
