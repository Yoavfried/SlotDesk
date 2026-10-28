import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const source=read('design/reference/pages/slotdesk-app.html');
const start=source.indexOf('function renderTable(){'),end=source.indexOf('/* ---------- step 4:',start);
assert.ok(start>=0&&end>start,'Reference table renderer exists');
let checks=0;
class Element {
  constructor(tag){this.tag=tag;this.children=[];this.value='';}
  set textContent(value){this.value=String(value);this.children=[];}
  get textContent(){return this.value+this.children.map(child=>child.textContent).join('');}
  set innerHTML(value){assert.equal(value,'','Imported labels must never become parsed table markup');this.value='';this.children=[];}
  appendChild(child){this.children.push(child);return child;}
}
const executive='<svg/onload=globalThis.unwanted=1>',name='<img/src=x/onerror=globalThis.unwanted=2>',city='<b>Example city</b>';
const tableRoot=new Element('div');
const context=vm.createContext({$:()=>tableRoot,cands:()=>[{}],exec:()=>({name:executive,tz:'UTC'}),execName:ex=>ex.name,
  parts:()=>[{name,city}],sorted:()=>[],el:(tag,cls,text)=>{const e=new Element(tag);if(text!=null)e.textContent=text;return e;}});
vm.runInContext(source.slice(start,end)+'\nrenderTable();',context,{timeout:1000});
const headers=tableRoot.children[0].children[0].children[0].children;
assert.equal(headers[1].value,executive);checks++;
assert.equal(headers[1].children[0].tag,'small');checks++;
assert.equal(headers[1].children[0].textContent,'UTC');checks++;
assert.equal(headers[2].value,name);checks++;
assert.equal(headers[2].children[0].textContent,city);checks++;
assert.equal(headers[2].children[0].tag,'small');checks++;
for(const file of ['slot-desk-landing.html','slot-desk-landing-self-contained.html']){
  const page=read('design/reference/pages/'+file);
  const copies=[...page.matchAll(/data:text\/html(?:;charset=[^;,"\s]+)?;base64,([A-Za-z0-9+/=]+)/g)]
    .map(match=>Buffer.from(match[1],'base64').toString('utf8'));
  assert.ok(copies.includes(source),'Embedded download matches corrected source: '+file);checks++;
}

for(const file of ['booking-overlaps-0945.js','onboarding-0946.js']){
  const run=vm.runInNewContext('('+read('scripts/accessibility/'+file)+')',{URL});
  for(const url of ['https://example.invalid/','chrome-extension://blpliafbiiidhcffegochddjhagkhhip/index.html','moz-extension://00000000-0000-0000-0000-000000000000/index.html']){
    let touched=false;
    await assert.rejects(run({url:()=>url,evaluate:()=>{touched=true;throw Error('Unexpected page access');}}),/local synthetic fixture/);
    assert.equal(touched,false,'Wrong targets rejected before accessing page data');checks++;
  }
  for(const record of [null,{total:9,unsafeMethods:0},{syntheticFixture:'slotdesk-calendar-fixture-v1',total:8,unsafeMethods:0}]){
    let actions=false;
    await assert.rejects(run({url:()=> 'http://127.0.0.1:8895/',evaluate:async()=>record,on:()=>{actions=true;}}),/Synthetic calendar transport/);
    assert.equal(actions,false,'Unconfirmed fixture rejected before actions');checks++;
  }
  const stop=new Error('Reached fixture-only body');let admitted=false;
  await assert.rejects(run({url:()=> 'http://127.0.0.1:8895/',evaluate:async()=>({syntheticFixture:'slotdesk-calendar-fixture-v1',total:9,unsafeMethods:0}),on:()=>{admitted=true;throw stop;}}),error=>error===stop);
  assert.equal(admitted,true);checks++;
}
assert.ok(read('scripts/accessibility/fixture.cjs').includes("syntheticFixture:'slotdesk-calendar-fixture-v1'"));checks++;
console.log(checks+' reference-rendering, embedded-copy and fixture-target safety checks passed; no browser or network used.');
