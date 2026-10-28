'use strict';
const assert=require('node:assert/strict'),L=require('./flight-lookup'),E=require('./slotdesk-engine'),TZ=require('./timezone-search');
const data=require('../data/airports.json'),lookup=L.create(data);
let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(value,m)=>{assert.ok(value,m);checks++;},bad=(fn,pattern)=>{assert.throws(fn,pattern);checks++;};
const city=code=>lookup.cities(code)[0];
for(const [code,name]of [['SFO','San Francisco'],['LAX','Los Angeles'],['JFK','New York'],['LHR','London'],['TLV','Tel Aviv'],['ACC','Accra']]){
  const rows=lookup.cities(code);eq(rows.length,1,'Airport code maps to one city');eq(rows[0].city,name);eq(rows[0].kind,'city');eq(rows[0].code,'');ok(!rows[0].label.includes(' · '),'City choice does not expose an arbitrary airport');ok(Number.isFinite(rows[0].lat)&&Number.isFinite(rows[0].lon));
}
eq(lookup.cities('Tel Aviv').filter(c=>c.country==='IL').length,1,'Airport administrative areas do not duplicate one city');
eq(lookup.cities('Tel-Aviv')[0].city,'Tel Aviv');eq(lookup.cities('TelAviv')[0].city,'Tel Aviv');eq(lookup.cities('New York City')[0].city,'New York');eq(lookup.cities('NYC')[0].city,'New York');
eq(lookup.cities('San Fransisco')[0].city,'San Francisco');eq(lookup.cities('London')[0].label,'London, United Kingdom');eq(lookup.cities('San Francisco CA')[0].label,'San Francisco, CA');
ok(lookup.cities('sao paulo').some(c=>L.normal(c.city)==='sao paulo'),'Search handles diacritics');
eq(lookup.cities('L'),[]);eq(lookup.cities(''),[]);eq(lookup.cities('London',2).length,2);eq(lookup.cities('XXX-NOT-A-CITY'),[]);
// A timezone shared by many cities must not replace the city chosen in the profile.
const sf=city('SFO'),la=city('LAX'),ny=city('JFK'),london=city('LHR');
const profileCity=TZ.search([{value:'America/Los_Angeles',label:'Pacific'}],'san francisco')[0].location;
eq(lookup.resolveCity(profileCity,'America/Los_Angeles').id,sf.id,'Profile city metadata wins over canonical Los Angeles timezone name');
eq(lookup.resolveCity({...profileCity,state:'California'},'US/Pacific').id,sf.id,'State names and timezone aliases remain compatible');
eq(lookup.resolveCity({name:'San Francisco',country:'United States',state:'CA'},'America/Los_Angeles').id,sf.id);
eq(lookup.resolveCity(null,'America/Los_Angeles').id,la.id,'A known canonical city is a deterministic fallback');
eq(lookup.resolveCity(null,'Asia/Jerusalem').label,'Jerusalem, Israel','Reference city without an airport remains a real city');
eq(lookup.resolveCity({name:'Jerusalem',countryCode:'IL'},'Asia/Jerusalem').city,'Jerusalem');
eq(lookup.resolveCity({name:'Tel Aviv-Yafo',countryCode:'IL',state:'Tel Aviv'},'Asia/Jerusalem').city,'Tel Aviv');
eq(lookup.resolveCity({name:'Unlisted city',countryCode:'US'},'America/Los_Angeles'),null,'Unknown explicit city is never silently changed to another city in its timezone');
eq(lookup.resolveCity(profileCity,'Europe/London'),null,'Stale profile city cannot override the effective trip timezone');
eq(lookup.resolveCity(null,'UTC'),null,'A non-city timezone cannot supply a made-up departure city');
eq(lookup.resolveCity(null,'Etc/GMT+4'),null);eq(lookup.resolveCity(profileCity,'Not/AZone'),null);eq(lookup.resolveCity(null,null),null);
eq(lookup.resolveCity({name:'Springfield',countryCode:'US'},'America/Chicago'),null,'Ambiguous same-name cities require a selection');
eq(lookup.resolveCity({name:'Springfield',countryCode:'US',state:'IL'},'America/Chicago').label,'Springfield, IL');
eq(lookup.resolveCity('San Francisco, CA','America/Los_Angeles').id,sf.id);
eq(lookup.resolveCity(lookup.byCode.get('SFO'),'America/Los_Angeles').id,sf.id,'Old airport endpoints can seed the new city form');
const sfNY=lookup.estimate(sf,ny),laNY=lookup.estimate(la,ny);
eq(sf.tz,la.tz);ok(sfNY.distanceKm>laNY.distanceKm+100,'Two cities in one timezone keep their own route geometry');ok(sfNY.minutes>laNY.minutes,'Route estimate uses city coordinates rather than timezone offsets');
ok(lookup.estimate(sf,la).minutes>=75&&lookup.estimate(sf,la).minutes<=120,'Short same-zone route has a plausible rough duration');
ok(lookup.estimate(london,ny).distanceKm>5400&&lookup.estimate(london,ny).distanceKm<5700);ok(sfNY.coarse,'City-based estimate is identified as approximate');eq(sfNY.minutes%5,0);eq(lookup.estimate(ny,sf).minutes,sfNY.minutes,'Estimate is route-based, not an airline schedule or wind prediction');
for(const [from,to]of [[null,ny],[{},ny],[{...sf,lat:91},ny],[{...sf,lon:Infinity},ny]])bad(()=>lookup.estimate(from,to),/Choose departure and destination cities/);
// Duration is elapsed time; destination local date/clock uses the city's actual zone on arrival.
const minutes=lookup.estimate(london,ny).minutes,departureA=E.zonedToInstant('2026-10-24',12*60,london.tz),departureB=E.zonedToInstant('2026-10-25',12*60,london.tz),arrivalA=departureA+minutes*60000,arrivalB=departureB+minutes*60000;
eq((departureB-departureA)/3600000,25,'Local departure conversion observes the UK clock change');eq(E.partsIn(arrivalB,ny.tz).min-E.partsIn(arrivalA,ny.tz).min,60,'Arrival is converted using destination DST, not a fixed timezone difference');
const overnightDeparture=E.zonedToInstant('2027-01-01',23*60,london.tz),tokyo=city('HND'),overnightArrival=overnightDeparture+lookup.estimate(london,tokyo).minutes*60000;
eq(E.partsIn(overnightArrival,tokyo.tz).ymd,'2027-01-02','Automatic arrival can cross midnight and destination dates');
// Saved airport endpoints and route detection remain supported.
eq(lookup.route('Flight SFO → JFK').from.code,'SFO');eq(lookup.route('Flight XXX > ZZZ'),null);ok(lookup.search('Heathrow').some(a=>a.code==='LHR'));ok(lookup.estimate(lookup.byCode.get('LHR'),lookup.byCode.get('JFK')).minutes>400);
const dateline=L.create([['AAA','West field','Dateline','', 'FJ','Pacific/Fiji',-16,179],['AAB','East field','Dateline','','FJ','Pacific/Fiji',-16,-179]]).cities('Dateline')[0];ok(Math.abs(dateline.lon)>170,'City centroid does not jump across the world when airports straddle the date line');
eq(L.create([['BAD','Bad','Bad','','US','Invalid/Zone',0,0],['NAN','NaN','NaN','','US','UTC',NaN,0]]).airports,0,'Invalid airport rows cannot produce a bogus route');
console.log(checks+' city lookup, profile origin, route estimate and daylight-saving checks passed');
