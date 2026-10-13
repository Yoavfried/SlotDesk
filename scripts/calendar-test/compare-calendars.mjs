import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

// A local export comparator. It never authenticates, sends, edits or deletes anything.
const metadata = new Set(['DTSTAMP', 'CREATED', 'LAST-MODIFIED', 'SEQUENCE']);
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
function separator(line) {
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') quoted = !quoted;
    if (line[i] === ':' && !quoted) return i;
  }
  throw new Error('Malformed calendar property.');
}
function property(line) {
  const i = separator(line), head = line.slice(0, i), name = head.split(';', 1)[0].toUpperCase();
  return { name, key: name + head.slice(name.length), value: line.slice(i + 1) };
}
function canonical(node) {
  return {
    type: node.type,
    properties: node.properties.filter(p => !metadata.has(p.name)).map(p => [p.key, p.value]).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
    children: node.children.map(canonical).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
  };
}
export function inventory(text) {
  if (Buffer.byteLength(text) > 16 * 1024 * 1024) throw new Error('Use a calendar export smaller than 16 MiB.');
  const lines = text.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '').split('\n'), stack = [], roots = [];
  for (const line of lines) {
    if (!line) continue;
    const p = property(line);
    if (p.name === 'BEGIN') {
      const node = { type: p.value.toUpperCase(), properties: [], children: [] };
      if (stack.length) stack.at(-1).children.push(node); else roots.push(node);
      stack.push(node);
    } else if (p.name === 'END') {
      if (!stack.length || stack.at(-1).type !== p.value.toUpperCase()) throw new Error('Unbalanced calendar components.');
      stack.pop();
    } else {
      if (!stack.length) throw new Error('Calendar property outside a component.');
      stack.at(-1).properties.push(p);
    }
  }
  if (stack.length || roots.length !== 1 || roots[0].type !== 'VCALENDAR') throw new Error('Use one complete .ics calendar export.');
  const root = roots[0], events = new Map();
  for (const node of root.children.filter(n => n.type === 'VEVENT')) {
    const uids = node.properties.filter(p => p.name === 'UID'), recurrence = node.properties.filter(p => p.name === 'RECURRENCE-ID');
    if (uids.length !== 1 || !uids[0].value || recurrence.length > 1) throw new Error('Event has missing or ambiguous identity.');
    const key = uids[0].value + (recurrence.length ? '|' + recurrence[0].key + ':' + recurrence[0].value : '');
    if (events.has(key)) throw new Error('Duplicate event identity in calendar export.');
    events.set(key, { content: digest(canonical(node)), properties: canonical(node).properties });
  }
  if (!events.size) throw new Error('The baseline/export contains no events.');
  return { events, timezone: digest({ definitions: root.children.filter(n => n.type === 'VTIMEZONE').map(canonical), zone: root.properties.filter(p => p.name === 'X-WR-TIMEZONE') }) };
}
export function compare(beforeText, afterText, expectedAdded = 0) {
  if (!Number.isSafeInteger(expectedAdded) || expectedAdded < 0) throw new Error('Expected additions must be a non-negative whole number.');
  const before = inventory(beforeText), after = inventory(afterText), removed = [], changed = [], added = [];
  for (const [id, event] of before.events) {
    if (!after.events.has(id)) removed.push(id);
    else if (after.events.get(id).content !== event.content) changed.push(id);
  }
  for (const id of after.events.keys()) if (!before.events.has(id)) added.push(id);
  const timezoneChanged = before.timezone !== after.timezone;
  return { passed: !removed.length && !changed.length && !timezoneChanged && added.length === expectedAdded,
    beforeCount: before.events.size, afterCount: after.events.size, removedCount: removed.length, changedCount: changed.length,
    addedCount: added.length, expectedAdded, timezoneChanged, ignoredMetadata: [...metadata] };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const [before, after, additions = '0', ...extra] = process.argv.slice(2);
    if (!before || !after || extra.length) throw new Error('Usage: node compare-calendars.mjs before.ics after.ics expected-new-events');
    const result = compare(await readFile(before, 'utf8'), await readFile(after, 'utf8'), Number(additions));
    console.log(JSON.stringify(result, null, 2));
    if (!result.passed) process.exitCode = 1;
  } catch (error) { console.error(error.message); process.exitCode = 2; }
}
