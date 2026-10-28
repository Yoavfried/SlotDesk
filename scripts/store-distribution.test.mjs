import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import {storeDistributionFile} from './store-distribution.mjs';

const app = fileURLToPath(new URL('../extension/', import.meta.url));
const source = [];
async function walk(directory) {
  for (const item of await readdir(directory, {withFileTypes: true})) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) await walk(file);
    else if (!item.name.endsWith('.test.js') && item.name !== 'README.md') {
      source.push({name: path.relative(app, file).split(path.sep).join('/'), data: await readFile(file)});
    }
  }
}
await walk(app);
const snapshots = new Map(source.map(({name, data}) => [name, Buffer.from(data)]));

for (const target of ['chromium', 'chromium-store', 'firefox', 'safari-source']) {
  test(`${target} changes only its authorized email-updates wording`, () => {
    const changed = [];
    const store = target === 'chromium-store' || target === 'firefox';
    for (const {name, data} of source) {
      const generated = storeDistributionFile(name, data, target);
      assert.deepEqual(data, snapshots.get(name), `${name}: source buffer was mutated`);
      if (!generated.equals(data)) changed.push(name);
      let expected = data.toString('utf8');
      if (store && name === 'index.html') {
        expected = expected.replaceAll('updates about SlotDesk and our future projects.', 'updates about SlotDesk.');
        const text = generated.toString('utf8');
        for (const id of ['onboarding-updates', 'registration-updates']) {
          assert.ok(text.includes(`id="${id}">You may email me occasional updates about SlotDesk. I can opt out at any time.</label>`));
        }
        assert.equal((text.match(/You may email me occasional updates about SlotDesk\./g) || []).length, 2);
        assert.ok(!text.includes('SlotDesk and our future projects'));
      } else if (store && name === 'privacy.html') {
        expected = expected.replace('optional project-updates box.', 'optional SlotDesk-updates box.')
          .replace('updates about SlotDesk and their future projects;', 'updates about SlotDesk;');
        const text = generated.toString('utf8');
        assert.ok(text.includes('If you opted in, the owners may use your address for occasional updates about SlotDesk; you can opt out at any time by emailing'));
        assert.ok(!text.includes('future projects'));
      } else {
        assert.strictEqual(generated, data, `${name}: untouched payload must retain its original Buffer`);
        continue;
      }
      assert.deepEqual(generated, Buffer.from(expected), `${name}: unexpected payload changes`);
    }
    assert.deepEqual(changed.sort(), store ? ['index.html', 'privacy.html'] : []);
  });
}

test('store packaging stops when expected consent copy drifts', () => {
  const index = snapshots.get('index.html');
  const privacy = snapshots.get('privacy.html');
  assert.throws(() => storeDistributionFile('index.html', Buffer.from(index.toString().replace('SlotDesk and our future projects', 'other products')), 'chromium-store'), /expected 2/);
  assert.throws(() => storeDistributionFile('privacy.html', Buffer.from(privacy.toString().replace('optional project-updates box.', 'optional box.')), 'firefox'), /expected 1/);
  assert.throws(() => storeDistributionFile('privacy.html', Buffer.from(privacy.toString().replace(' and their future projects;', ';')), 'chromium-store'), /expected 1/);
});

test('packaging leaves every source file unchanged on disk', async () => {
  for (const {name} of source) assert.deepEqual(await readFile(path.join(app, ...name.split('/'))), snapshots.get(name), name);
});
