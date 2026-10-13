import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const output = path.join(root, 'dist', 'SlotDesk-calendar-test');
const events = [], stamp = '20261012T000000Z';
const utc = time => new Date(time).toISOString().replace(/[-:]/g, '').replace('.000', '');
const text = value => value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
function add(id, title, properties) {
  events.push(['BEGIN:VEVENT', 'UID:slotdesk-test-' + id + '@example.test', 'DTSTAMP:' + stamp,
    'SUMMARY:' + text(title), 'DESCRIPTION:Synthetic SlotDesk acceptance fixture. No guests or invitations.',
    'CLASS:PRIVATE', ...properties, 'END:VEVENT']);
}
const freeFrom = Date.parse('2026-10-20T10:00:00Z'), freeTo = Date.parse('2026-10-20T11:00:00Z');
for (let day = 0; day < 21; day++) for (let quarter = 0; quarter < 48; quarter++) {
  const from = Date.parse('2026-10-19T06:00:00Z') + day * 86400000 + quarter * 15 * 60000, to = from + 12 * 60000;
  if (from < freeTo && to > freeFrom) continue;
  add('busy-' + day + '-' + quarter, 'SD TEST BUSY ' + day + ' / ' + quarter,
    ['DTSTART:' + utc(from), 'DTEND:' + utc(to), 'STATUS:CONFIRMED', 'TRANSP:OPAQUE']);
}
add('weekly', 'SD TEST UTC weekly series', ['DTSTART:20261019T083000Z', 'DTEND:20261019T091500Z', 'RRULE:FREQ=WEEKLY;COUNT=3', 'EXDATE:20261026T083000Z']);
add('daily', 'SD TEST UTC daily series', ['DTSTART:20261019T073000Z', 'DTEND:20261019T074500Z', 'RRULE:FREQ=DAILY;COUNT=7']);
add('holiday', 'Holiday - SD TEST', ['DTSTART;VALUE=DATE:20261027', 'DTEND;VALUE=DATE:20261028']);
add('leave', 'Leave - SD TEST two days', ['DTSTART;VALUE=DATE:20261029', 'DTEND;VALUE=DATE:20261031']);
add('midnight', 'SD TEST cross-midnight / DST display', ['DTSTART:20261024T233000Z', 'DTEND:20261025T003000Z']);
add('transparent', 'SD TEST transparent note in known free window', ['DTSTART:20261020T101500Z', 'DTEND:20261020T104500Z', 'TRANSP:TRANSPARENT']);
add('tentative', 'SD TEST tentative hold', ['DTSTART:20261022T110000Z', 'DTEND:20261022T120000Z', 'STATUS:TENTATIVE']);
add('overlap', 'SD TEST overlapping busy event', ['DTSTART:20261020T080000Z', 'DTEND:20261020T084500Z']);
add('flight', 'SD TEST TLV > JFK', ['DTSTART:20261023T190000Z', 'DTEND:20261024T050000Z']);
// Fold on UTF-8 character boundaries, keeping every physical line at most 75 octets.
function fold(line) {
  let result = '', part = '';
  for (const character of line) {
    if (Buffer.byteLength(part + character) > 75) { result += part + '\r\n'; part = ' '; }
    part += character;
  }
  return result + part;
}
const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SlotDesk//Synthetic acceptance test//EN', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:SlotDesk disposable acceptance test', 'X-WR-TIMEZONE:UTC', ...events.flat(), 'END:VCALENDAR'];
await mkdir(output, { recursive: true });
await writeFile(path.join(output, 'busy-calendar.ics'), lines.map(fold).join('\r\n') + '\r\n');
await writeFile(path.join(output, 'reference.json'), JSON.stringify({ synthetic: true, componentCount: events.length,
  range: { from: '2026-10-19', through: '2026-11-08' }, timestamps: 'UTC', attendeeCount: 0,
  knownFreeWindow: { from: '2026-10-20T10:00:00Z', through: '2026-10-20T11:00:00Z', transparentNote: true },
  scenarios: ['dense ordinary events', 'UTC recurring series with exclusion', 'all-day holiday and leave', 'cross-midnight/DST display', 'transparent event', 'tentative hold', 'overlap', 'flight'],
  limits: ['Import does not establish RSVP or sharing/delegation coverage.', 'Google may normalize imported fields; use a post-import export as the baseline.', 'This fixture is not a live Google acceptance result.'] }, null, 2) + '\n');
await copyFile(path.join(root, 'scripts/calendar-test/compare-calendars.mjs'), path.join(output, 'compare-calendars.mjs'));
await copyFile(path.join(root, 'docs/products/slotdesk/calendar-acceptance.md'), path.join(output, 'READ-ME.md'));
console.log('Prepared ' + events.length + ' synthetic event components, with no attendees, in dist/SlotDesk-calendar-test/.');
