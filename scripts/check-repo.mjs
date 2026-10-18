import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [];
const errors = [];
const contents = new Map();
const skip = new Set(['.git', 'dist', 'node_modules', '.a11y-tools', '.playwright-cli', 'output']);

async function walk(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    if (skip.has(item.name)) continue;
    const file = path.join(directory, item.name);
    if (item.isDirectory()) await walk(file);
    else files.push(file);
  }
}
await walk(root);

const relative = file => path.relative(root, file).split(path.sep).join('/');
async function read(file) {
  if (!contents.has(file)) contents.set(file, await readFile(file, 'utf8'));
  return contents.get(file);
}

async function checkLink(source, reference, checkFragment = false) {
  reference = reference.trim().replace(/&amp;/g, '&');
  if (!reference || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) return;
  const [pathname, fragment] = reference.split('#', 2);
  let target;
  try {
    target = pathname ? path.resolve(path.dirname(source), decodeURIComponent(pathname.split('?')[0])) : source;
    if (target !== root && !target.startsWith(root + path.sep)) throw new Error('outside repository');
    const info = await stat(target);
    if (info.isDirectory()) return;
    if (checkFragment && fragment && /\.html$/.test(target)) {
      const html = await read(target);
      const ids = new Set([...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map(match => match[1]));
      if (!ids.has(decodeURIComponent(fragment))) throw new Error('missing HTML anchor');
    }
  } catch (error) {
    errors.push(`${relative(source)}: ${reference} (${error.code === 'ENOENT' ? 'missing local target' : error.message})`);
  }
}

let syntaxCount = 0;
let documentCount = 0;
for (const file of files) {
  const name = relative(file);
  if (/\.(?:js|cjs|mjs)$/.test(file)) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    syntaxCount++;
    if (result.status !== 0) errors.push(`${name}: JavaScript syntax failed\n${result.stderr || result.error?.message || ''}`);
  }
  if (/\.md$/.test(file) && !name.startsWith('docs/archive/') && !name.startsWith('design/reference/')) {
    const markdown = (await read(file)).replace(/^```[^\n]*\n[\s\S]*?^```/gm, '');
    for (const match of markdown.matchAll(/!?\[[^\]]*\]\((?:<([^>]+)>|([^\s)]+))(?:\s+"[^"]*")?\)/g)) {
      await checkLink(file, match[1] || match[2], true);
    }
    documentCount++;
  }
  if (/\.html$/.test(file)) {
    const html = await read(file);
    for (const match of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/g)) await checkLink(file, match[1], true);
    documentCount++;
  }
  if (/\.css$/.test(file)) {
    for (const match of (await read(file)).matchAll(/url\(\s*["']?([^\s'"()]+)["']?\s*\)/g)) await checkLink(file, match[1]);
  }
}

const app = path.join(root, 'extension');
const manifest = JSON.parse(await read(path.join(app, 'manifest.json')));
for (const key of ['side_panel', 'background']) {
  const entry = key === 'side_panel' ? manifest[key]?.default_path : manifest[key]?.service_worker;
  if (entry) await checkLink(path.join(app, 'manifest.json'), entry);
}
const expectedScopes = ['calendar.events', 'calendar.calendarlist.readonly', 'calendar.events.freebusy'];
const scopes = manifest.oauth2?.scopes || [];
if (scopes.length !== expectedScopes.length || expectedScopes.some(scope => !scopes.includes(`https://www.googleapis.com/auth/${scope}`))) {
  errors.push('manifest.json: unexpected pilot OAuth scope set');
}
if (!manifest.key || !/^\d+-[a-z\d]+\.apps\.googleusercontent\.com$/i.test(manifest.oauth2?.client_id || '')) {
  errors.push('manifest.json: pinned extension/OAuth identity missing');
}
for (const filename of ['index.html', 'START-HERE.html']) {
  if (!(await read(path.join(app, filename))).includes(manifest.version)) errors.push(`${filename}: build label differs from manifest`);
}
const changelog = await read(path.join(root, 'docs/changelog.md'));
if (!changelog.includes(`## ${manifest.version} —`)) errors.push('SlotDesk changelog: current release missing');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Repository checks passed: ${syntaxCount} JavaScript files, ${documentCount} current documents/reference pages, local assets, and SlotDesk ${manifest.version} manifest consistency.`);
}
