(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SlotFlightLookup=factory();})(typeof self!=='undefined'?self:this,function(){
  'use strict';
  const normal=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const states={Alabama:'AL',Alaska:'AK',Arizona:'AZ',Arkansas:'AR',California:'CA',Colorado:'CO',Connecticut:'CT',Delaware:'DE',Florida:'FL',Georgia:'GA',Hawaii:'HI',Idaho:'ID',Illinois:'IL',Indiana:'IN',Iowa:'IA',Kansas:'KS',Kentucky:'KY',Louisiana:'LA',Maine:'ME',Maryland:'MD',Massachusetts:'MA',Michigan:'MI',Minnesota:'MN',Mississippi:'MS',Missouri:'MO',Montana:'MT',Nebraska:'NE',Nevada:'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM','New York':'NY','North Carolina':'NC','North Dakota':'ND',Ohio:'OH',Oklahoma:'OK',Oregon:'OR',Pennsylvania:'PA','Rhode Island':'RI','South Carolina':'SC','South Dakota':'SD',Tennessee:'TN',Texas:'TX',Utah:'UT',Vermont:'VT',Virginia:'VA',Washington:'WA','West Virginia':'WV',Wisconsin:'WI',Wyoming:'WY','District of Columbia':'DC'};
  const cityAliases={'new york city':'new york',nyc:'new york',sf:'san francisco','san fransisco':'san francisco',telaviv:'tel aviv','tel aviv yafo':'tel aviv','tel aviv jaffa':'tel aviv'};
  const cityName=v=>cityAliases[normal(v)]||normal(v);
  function stateCode(value){const key=Object.keys(states).find(s=>normal(s)===normal(value));return normal(states[key]||value);}
  const canonicalCache=new Map();
  function canonical(zone){if(typeof zone!=='string'||!zone.trim())return null;if(!canonicalCache.has(zone)){try{canonicalCache.set(zone,new Intl.DateTimeFormat('en',{timeZone:zone}).resolvedOptions().timeZone);}catch(_){canonicalCache.set(zone,null);}}return canonicalCache.get(zone);}
  const point=p=>p&&[p.lat,p.lon].every(Number.isFinite)&&Math.abs(p.lat)<=90&&Math.abs(p.lon)<=180;
  function centre(rows){let x=0,y=0,z=0;for(const a of rows){const lat=a.lat*Math.PI/180,lon=a.lon*Math.PI/180;x+=Math.cos(lat)*Math.cos(lon);y+=Math.cos(lat)*Math.sin(lon);z+=Math.sin(lat);}return {lat:Math.atan2(z,Math.hypot(x,y))*180/Math.PI,lon:Math.atan2(y,x)*180/Math.PI};}
  function create(data){
    const countryNames=new Intl.DisplayNames(['en'],{type:'region'}),airports=[],byCode=new Map(),groups=new Map(),airportCities=new Map();
    function countryName(code){try{return countryNames.of(code)||code;}catch(_){return code;}}
    function group(a){const key=[cityName(a.city),a.country,a.country==='US'?stateCode(a.state):'',canonical(a.tz)].join('|');if(!groups.has(key))groups.set(key,[]);groups.get(key).push(a);}
    for(const [code,name,city,state,country,tz,lat,lon]of data){
      if(!canonical(tz)||!point({lat,lon})||!city)continue;
      const location=city+', '+(country==='US'?(states[state]||state||'US'):countryName(country)),a={id:'airport:'+code,code,name,city,state,country,countryCode:country,tz,timezone:tz,lat,lon,label:location+' · '+code,kind:'airport',search:normal([code,name,city,state,country,countryName(country),location].join(' '))};
      airports.push(a);byCode.set(code,a);group(a);
    }
    // IANA's public-domain reference city has no airport in the bundled airport data.
    // Coordinates: https://data.iana.org/time-zones/tzdb/zone.tab (+314650+0351326).
    if(![...groups.values()].some(rows=>cityName(rows[0].city)==='jerusalem'&&rows[0].country==='IL'))group({city:'Jerusalem',state:'',country:'IL',tz:'Asia/Jerusalem',lat:31+46/60+50/3600,lon:35+13/60+26/3600});
    const cityRows=[...groups.entries()].map(([key,rows])=>{
      const a=rows[0],label=a.city+', '+(a.country==='US'?(states[a.state]||a.state||'US'):countryName(a.country)),names=[a.city,...Object.keys(cityAliases).filter(alias=>cityAliases[alias]===cityName(a.city))],row={id:'city:'+key,code:'',name:a.city,city:a.city,state:a.state,country:a.country,countryCode:a.country,tz:a.tz,timezone:a.tz,...centre(rows),label,kind:'city',airportCount:rows.filter(r=>r.code).length,search:normal([...names,a.state,states[a.state],a.country,countryName(a.country),label].join(' '))};
      for(const airport of rows)if(airport.code)airportCities.set(airport.code,row);return row;
    });
    function search(query,limit=16){const q=normal(query),words=q.split(' ').filter(Boolean);if(q.length<2)return [];return [...cityRows,...airports].map(a=>({a,score:words.every(w=>a.search.includes(w))?1+(normal(a.code)===q?100:0)+(cityName(a.city)===cityName(q)?40:0)+(a.kind==='city'?10:0)+(a.search.startsWith(q)?15:0):0})).filter(r=>r.score>0).sort((a,b)=>b.score-a.score||a.a.label.localeCompare(b.a.label)).slice(0,limit).map(r=>r.a);}
    function cities(query,limit=16){
      const q=normal(query),words=q.split(' ').filter(Boolean);if(q.length<2)return [];
      const coded=airportCities.get(q.toUpperCase());if(coded)return [coded].slice(0,limit);return cityRows.map(a=>({a,score:words.every(w=>a.search.includes(w))?1+(cityName(a.city)===cityName(q)?80:0)+(a.search.startsWith(q)?20:0):0})).filter(r=>r.score>0).sort((a,b)=>b.score-a.score||b.a.airportCount-a.a.airportCount||a.a.label.localeCompare(b.a.label)).slice(0,limit).map(r=>r.a);
    }
    function resolveCity(location,zone){
      const requestedZone=zone||location?.timezone||location?.tz,tz=canonical(requestedZone);if(requestedZone&&!tz)return null;const eligible=cityRows.filter(c=>!tz||canonical(c.tz)===tz);
      if(location){
        if(typeof location==='object'){
          const code=String(location.code||'').toUpperCase();if(code&&airportCities.has(code)){const city=airportCities.get(code);return !tz||canonical(city.tz)===tz?city:null;}
          const id=eligible.find(c=>c.id===location.id);if(id)return id;
          const name=cityName(location.city||location.name),country=normal(location.countryCode||location.country),state=stateCode(location.state);
          const found=eligible.filter(c=>cityName(c.city)===name&&(!country||normal(c.country)===country||normal(countryName(c.country))===country)&&(!state||c.country!=='US'||stateCode(c.state)===state));
          return found.length===1?found[0]:null;
        }
        const label=normal(location),found=eligible.filter(c=>normal(c.label)===label||cityName(c.city)===cityName(location));return found.length===1?found[0]:null;
      }
      if(!tz)return null;
      const name=cityName(tz.split('/').pop().replace(/_/g,' ')),found=eligible.filter(c=>cityName(c.city)===name);return found.length===1?found[0]:null;
    }
    function route(text){const pattern=/\b([A-Z]{3})\s*(?:→|->|>|–|—|-|\bto\b)\s*([A-Z]{3})\b/gi;for(const m of String(text||'').matchAll(pattern)){const from=byCode.get(m[1].toUpperCase()),to=byCode.get(m[2].toUpperCase());if(from&&to&&from.code!==to.code)return {from,to};}return null;}
    const cityTerms=new Map();for(const c of cityRows){const names=[c.city,...Object.keys(cityAliases).filter(alias=>cityAliases[alias]===cityName(c.city))];for(const name of names)for(const term of [name,c.label,name+' '+c.country,name+' '+countryName(c.country),...(c.country==='US'?[name+' '+c.state]:[])]){const key=normal(term);if(!cityTerms.has(key))cityTerms.set(key,[]);if(!cityTerms.get(key).includes(c))cityTerms.get(key).push(c);}}
    function exactCities(value){const key=normal(value),airport=airportCities.get(key.toUpperCase());return airport?[airport]:cityTerms.get(key)||[];}
    function cityRoute(text){
      const value=String(text||'').slice(0,40000).replace(/<[^>]*>/g,' '),separator=/(?:→|->|>|–|—|\bto\b)/gi;
      function edge(value,from){const words=normal(value).split(' ');for(let n=Math.min(12,words.length);n>0;n--){const matches=exactCities((from?words.slice(-n):words.slice(0,n)).join(' '));if(matches.length)return matches;}return [];}
      for(const match of value.matchAll(separator)){const before=value.slice(0,match.index).split(/[\n\r;]/).at(-1),after=value.slice(match.index+match[0].length).split(/[\n\r;]/)[0],from=edge(before,true),to=edge(after,false);if(!from.length||!to.length)continue;const a=from.length===1?from[0]:null,b=to.length===1?to[0]:null;if(a&&b&&a.id===b.id)continue;return {from:a,to:b,ambiguous:!a||!b};}return null;
    }
    function estimate(from,to){if(!point(from)||!point(to))throw new Error('Choose departure and destination cities with valid locations to calculate arrival.');const rad=v=>v*Math.PI/180,a=rad(from.lat),b=rad(to.lat),x=Math.sin((b-a)/2)**2+Math.cos(a)*Math.cos(b)*Math.sin(rad(to.lon-from.lon)/2)**2,km=6371*2*Math.asin(Math.sqrt(Math.min(1,x)));return {distanceKm:Math.round(km),minutes:Math.max(45,Math.ceil((km/800*60+45)/5)*5),coarse:from.kind==='city'||to.kind==='city'};}
    return {search,cities,resolveCity,route,cityRoute,exactCities,estimate,byCode,airports:airports.length};
  }
  let loading;
  function load(fetchImpl=globalThis.fetch){if(!loading)loading=fetchImpl('data/airports.json').then(r=>{if(!r.ok)throw new Error('The local city lookup could not load. Try again to calculate arrival.');return r.json();}).then(create).catch(e=>{loading=null;throw e;});return loading;}
  return {create,load,normal};
});
