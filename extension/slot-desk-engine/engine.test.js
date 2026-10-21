const E = require('./slotdesk-engine.js');
const assert = require('assert');
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };

const NOW = '2026-10-18T08:00:00+03:00';
const guestLimit = undefined;   // everyone uses the default two layers: work 09-18, ok 07-20
const people = () => [
  { id: 'dana', name: 'Dana', tz: 'Asia/Jerusalem', days: E.WEEK_SUN_THU(), buffer: 15, notice: 24, calendar: 'detail', busy: [],
    blocks: [{ day: 3, s: '13:00', e: '18:00', label: 'Focus afternoon' }] },
  { id: 'sarah', name: 'Sarah', tz: 'Europe/London', days: E.WEEK_MON_FRI(), limit: guestLimit, calendar: 'busy', busy: [] },
  { id: 'mike', name: 'Mike', tz: 'America/New_York', days: E.WEEK_MON_FRI(), limit: guestLimit, calendar: 'none', busy: [] },
];
const local = (iso, tz) => { const p = E.partsIn(new Date(iso).getTime(), tz); return p.ymd + ' ' + String(p.hh).padStart(2, '0') + ':' + String(p.mm).padStart(2, '0'); };

/* A. daylight saving: Israel and the UK change on 25 Oct 2026, the US on 1 Nov */
{
  const at = d => E.zonedToInstant(d, 16 * 60, 'Asia/Jerusalem');
  ok(local(at('2026-10-20'), 'America/New_York') === '2026-10-20 09:00', 'before: 16:00 IL = 09:00 NY');
  ok(local(at('2026-10-27'), 'America/New_York') === '2026-10-27 10:00', 'gap week: 16:00 IL = 10:00 NY');
  ok(local(at('2026-11-03'), 'America/New_York') === '2026-11-03 09:00', 'after: 16:00 IL = 09:00 NY');
  ok(local(at('2026-10-27'), 'Europe/London') === '2026-10-27 14:00', 'London stays 2h behind');
}

/* B. open slots: everyone inside working hours beats a stretch; weekends respected */
{
  const r = E.findSlots({ now: NOW, anchorTz: 'Asia/Jerusalem', duration: 45, range: { from: '2026-10-19', to: '2026-10-23' }, people: people(), want: 3 });
  ok(r.open.length === 3, 'three options');
  ok(new Set(r.open.map(s => s.day)).size === 3, 'on three different days');
  ok(r.open.every(s => s.maxOutside === 0), 'top options need no stretch');
  ok(r.open.every(s => s.people.every(p => p.band === 'ok')), 'all ok');
  ok(!r.open.some(s => s.day === '2026-10-23'), 'no Friday (not a working day in Israel)');
  ok(!r.open.some(s => s.day === '2026-10-21' && E.partsIn(s.start, 'Asia/Jerusalem').hh >= 13), 'Wednesday focus block respected');
  ok(r.open.every(s => s.notes.some(x => /cannot see Mike/.test(x))), 'flags the calendar it cannot see');
  const all = E.evaluate({ now: NOW, anchorTz: 'Asia/Jerusalem', duration: 45, range: { from: '2026-10-19', to: '2026-10-23' }, people: people() });
  ok(all.open.every(s => new Date(s.start) >= new Date('2026-10-19T08:00:00+03:00')), '24h notice');
  // the only fully comfortable window is 16:00–18:00 Israel time (NY starts at 09:00)
  ok(all.open.filter(s => s.maxOutside === 0).every(s => { const p = E.partsIn(s.start, 'Asia/Jerusalem'); return p.min >= 960 && p.min + 45 <= 1080; }), 'comfortable window is 16:00-18:00 IL');
  ok(all.open.some(s => s.maxOutside > 0), 'stretch slots exist but rank lower');
  ok(all.open.findIndex(s => s.maxOutside > 0) > all.open.filter(s => s.maxOutside === 0).length - 1, 'stretch after ok');
}

/* C. calendars + buffer */
{
  const P = people();
  P[0].busy = [{ start: '2026-10-20T16:00:00+03:00', end: '2026-10-20T17:00:00+03:00', title: 'Board prep', attendees: 3 }];
  const all = E.evaluate({ now: NOW, anchorTz: 'Asia/Jerusalem', duration: 45, range: { from: '2026-10-20', to: '2026-10-20' }, people: P });
  const starts = all.open.map(s => local(s.start, 'Asia/Jerusalem').slice(11));
  ok(!starts.includes('16:00') && !starts.includes('16:30'), 'busy time not offered');
  ok(!starts.includes('17:00'), '17:00 breaks the 15-minute buffer after a meeting ending 17:00');
  ok(starts.includes('17:20'), 'prefer the valid 10-minute start over a redundant 17:15 boundary');
  const fine = E.evaluate({ now: NOW, anchorTz: 'Asia/Jerusalem', duration: 30, step: 15, spacingMode: 'custom', range: { from: '2026-10-20', to: '2026-10-20' }, people: P });
  ok(fine.open.map(s => local(s.start, 'Asia/Jerusalem').slice(11)).includes('17:15'), '17:15 respects buffer');
}

/* D. manual constraint */
{
  const c = [{ from: '2026-10-20T00:00:00+03:00', to: '2026-10-21T00:00:00+03:00', who: 'all', label: 'Board week — keep Tuesday clear' }];
  const all = E.evaluate({ now: NOW, anchorTz: 'Asia/Jerusalem', duration: 45, range: { from: '2026-10-19', to: '2026-10-22' }, people: people(), constraints: c });
  ok(!all.open.some(s => s.day === '2026-10-20'), 'manually blocked day removed');
  ok(Object.keys(all.rejected).some(k => /Board week/.test(k)), 'and the reason is reported');
}

/* E. fallback: nothing open */
{
  const P = people();
  P.push({ id: 'opt', name: 'Yusuf', tz: 'Asia/Dubai', required: false, days: E.WEEK_MON_FRI(), limit: guestLimit, calendar: 'none', busy: [] });
  P[0].limit = { s: '09:00', e: '18:00' };   // this exec never stretches: ok hours = working hours
  const day = d => '2026-10-' + d;
  const ev = (d, s, e, x) => Object.assign({ start: day(d) + 'T' + s + ':00+03:00', end: day(d) + 'T' + e + ':00+03:00' }, x);
  P[0].busy = [
    ev(19, '09:00', '18:00', { type: 'ooo', title: 'Out of office' }),
    ev(20, '10:00', '15:45', { title: 'Offsite', attendees: 9 }),
    ev(20, '16:00', '17:00', { title: 'Customer QBR', attendees: 6, external: true }),
    ev(20, '17:15', '18:00', { title: 'Weekly 1:1', attendees: 2, recurring: true }),
    ev(21, '09:00', '13:00', { title: 'Planning', attendees: 4 }),
    ev(22, '15:00', '16:30', { title: 'Hold: deck review', attendees: 1 }),
    ev(22, '16:45', '18:00', { title: 'Hiring sync', attendees: 3, status: 'tentative' }),
  ];
  P[1].busy = [ev(22, '16:00', '17:30', {})];   // Sarah: busy block only
  const r = E.findSlots({ now: NOW, anchorTz: 'Asia/Jerusalem', duration: 45, range: { from: '2026-10-19', to: '2026-10-22' }, people: P, want: 3 });
  ok(r.open.length < 3, 'not enough open slots');
  ok(r.fallback, 'fallback offered');
  const changes = r.fallback.softer.map(s => s.change);
  ok(changes.some(c => /5 days further/.test(c)), 'suggests a wider range');
  ok(r.fallback.taken.length > 0, 'suggests taken slots');
  ok(!r.fallback.taken.some(s => s.day === '2026-10-19'), 'never suggests moving an out-of-office day');
  const first = r.fallback.taken[0];
  ok(first.score.explicitMax === 0, 'best option avoids configured meeting-buffer inconvenience');
  ok(first.score.guestMax === 0, 'guest working-hour fit precedes ordinary moving cost');
  console.log('\nFALLBACK sample:');
  r.fallback.softer.forEach(s => console.log('  softer:', s.change, '->', s.slots.map(x => local(x.start, 'Asia/Jerusalem')).join(' | ')));
  r.fallback.taken.forEach(s => console.log('  taken :', local(s.start, 'Asia/Jerusalem'), 'cost', s.cost, '->', s.toMove.map(t => t.who + ': ' + t.label).join('; ')));
}

/* E2. what the fallback may and may not touch */
{
  const me = { name: 'Dana', calendar: 'detail' };
  ok(E.classify({ title: 'Flight LY381 TLV → MXP', attendees: 1 }, me).cost === Infinity, 'flights are never offered');
  ok(E.classify({ title: 'DNS', attendees: 1, recurring: true }, me).cost === Infinity, 'do-not-schedule blocks are never offered');
  ok(E.classify({ title: 'Commute to the hotel', attendees: 1 }, me).cost === Infinity, 'commutes are never offered');
  ok(E.classify({ title: 'Family time', attendees: 1 }, me).cost === Infinity, 'personal time is never offered');
  ok(E.classify({ title: 'Hold: deck review', attendees: 1 }, me).cost === 1, 'an explicit hold is cheap');
  ok(E.classify({ title: 'Gym', attendees: 1 }, me).cost === 3, 'a solo entry with an unclear title is not assumed movable');
  ok(E.classify({ title: 'Weekly 1:1', attendees: 2, recurring: true }, me).cost < E.classify({ title: 'Kickoff', attendees: 2 }, me).cost, 'recurring cheaper than one-off');
  ok(E.classify({ title: 'QBR', attendees: 3, external: true }, me).cost > E.classify({ title: 'All hands', attendees: 40 }, me).cost, 'external costs more than a big internal');
  ok(E.classify({ title: 'anything' }, { name: 'Sarah', calendar: 'busy' }).cost === 4, 'hidden details -> ask');
}

/* E3. two layers of hours: work 09-18 is good, ok 07-20 is allowed, beyond is bad */
{
  const p = { name: 'Sam', tz: 'Europe/London' };            // no settings at all -> defaults
  const at = (hm, dur) => { const [h, m] = hm.split(':').map(Number); const s = E.zonedToInstant('2026-10-20', h * 60 + m, 'Europe/London'); return E.fitPerson(p, s, s + dur * 60000, 0); };
  ok(at('09:00', 60).band === 'ok', '09:00 is working hours');
  ok(at('17:00', 60).band === 'ok', 'ending exactly 18:00 is working hours');
  ok(at('17:30', 60).band === 'stretch', 'ending 18:30 is ok hours');
  ok(at('07:00', 30).band === 'stretch', '07:00 is ok hours');
  ok(at('19:00', 60).band === 'stretch', 'ending exactly 20:00 is ok hours');
  ok(at('06:30', 60).band === 'no', 'starting 06:30 is bad');
  ok(at('19:30', 60).band === 'no', 'ending 20:30 is bad');
  ok(at('17:30', 60).outside === 30, 'counts only the minutes outside working hours');
  const custom = Object.assign({}, p, { days: E.WEEK_MON_FRI('10:00', '16:00'), limit: { s: '08:00', e: '22:00' } });
  const s = E.zonedToInstant('2026-10-20', 21 * 60, 'Europe/London');
  ok(E.fitPerson(custom, s, s + 30 * 60000, 0).band === 'stretch', 'both layers can be changed per person');
}

/* F. travel moves the exec's working hours */
{
  const P = people();
  P[0].blocks = []; P[0].travel = [{ from: '2026-10-19', to: '2026-10-23', tz: 'America/New_York', label: 'New York' }];
  const all = E.evaluate({ now: NOW, anchorTz: 'Asia/Jerusalem', duration: 45, range: { from: '2026-10-19', to: '2026-10-22' }, people: P });
  ok(all.open.length > 0 && all.open.every(s => { const p = E.partsIn(s.start, 'America/New_York'); return p.min >= 420 && p.min + 45 <= 1200; }), 'slots follow New York hours while travelling');
}
console.log('\n' + n + ' checks passed');
