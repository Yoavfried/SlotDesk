import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const directory = fileURLToPath(new URL('../extension/', import.meta.url));
for (const file of ['engine', 'regression', 'pilot', 'booking', 'safety', 'proposal', 'calendar-view', 'upgrade', 'calendar-browser', 'management', 'rescheduling', 'editing']) {
  const result = spawnSync(process.execPath, [`slot-desk-engine/${file}.test.js`], {
    cwd: directory,
    stdio: 'inherit'
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
