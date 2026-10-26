const assert=require('node:assert/strict'),F=require('./configuration-files'),R=require('./profile-rules'),T=require('./trips'),L=require('./leads');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++;};
const file=(columns,row)=>({format:'slotdesk-profiles',schemaVersion:1,columns,rows:[row]});
for(const value of ['^(.+)+Z$','(a|aa)+$','a{999999}','a.*a.*a.*Z','(a)\\1']){
  eq(R.safeLegacy(value),false);
  assert.throws(()=>F.readProfiles(file(['email','timezone','eventRules'],['guest@example.test','UTC',{protect:value}]),[0]),/unsupported older event rule/);checks++;
  assert.throws(()=>R.detects({eventRules:{protect:value}},'protect','a'.repeat(34)),/unsupported older event rule/);checks++;
}
for(const value of ['board|holiday','\\bdoctor\\b','(?!)','do not (schedule|book|move)','pick ?up','^\\s*hold\\b','\\b[A-Z]{3}\\s*>\\s*[A-Z]{3}\\b'])eq(R.safeLegacy(value),true);
eq(R.detects({eventRules:{protect:'\\b[A-Z]{3}\\s*>\\s*[A-Z]{3}\\b'}},'protect','TLV > JFK'),true);
eq(R.detects({keywordMatchingVersion:1,ruleTerms:{protect:'(a+)+$'}},'protect','aaaa'),false);
const flight={id:'f',departure:'2026-11-01T09:00:00Z',arrival:'2026-11-01T11:00:00Z',departureZone:'UTC',arrivalZone:'UTC',label:'Flight',link:{calendarId:'c',eventId:'e',signature:'s'},occurrences:{side:'"><p>Forged</p>',values:[]},choices:[{}],details:true,previousTime:'Forged'};
const imported=F.readProfiles(file(['email','timezone','trips','tripSchemaVersion'],['guest@example.test','UTC',[{id:'trip',name:'Trip',originZone:'UTC',originLocation:'Origin',flights:[flight]}],1]),[0]).profiles[0].trips[0].flights[0];
eq(imported,T.savedFlight(flight));eq(imported.link,flight.link);eq(imported.occurrences,undefined);eq(imported.choices,undefined);eq(T.savedFlight(flight).previousTime,undefined);
const current={profiles:[],constraints:[],settings:{leadSharingConsent:false}},fresh={profiles:[],constraints:[],settings:{}},backup=F.exportFile(current,{theme:'light',clock:'24',dateFormat:'dmy'});
eq(backup.settings.leadSharingConsent,undefined);
eq(F.prepare({file:backup,selected:[],current,fresh,restore:true,epoch:'restore'}).state.settings.leadSharingConsent,false);
async function consent(){
  let granted=false,requests=0,removed,listener;
  const api={runtime:{getManifest:()=>({browser_specific_settings:{gecko:{data_collection_permissions:{optional:['technicalAndInteraction']}}}})},permissions:{getAll:async()=>({data_collection:granted?['technicalAndInteraction']:[]}),request:async value=>{requests++;eq(value,{data_collection:['technicalAndInteraction']});return granted=true;},remove:async value=>{removed=value;granted=false;},onRemoved:{addListener:fn=>listener=fn}}};
  const sharing=L.sharing(api);eq(sharing.optional,true);eq(await sharing.allowed(),false);eq(requests,0);
  eq(await sharing.request(),true);eq(await sharing.allowed(),true);await sharing.revoke();eq(removed,{data_collection:['technicalAndInteraction']});eq(await sharing.allowed(),false);
  let changed=0;sharing.changed(()=>changed++);listener({permissions:['tabs']});eq(changed,0);listener({data_collection:['technicalAndInteraction']});eq(changed,1);
  api.permissions.request=async()=>false;eq(await sharing.request(),false);api.permissions.getAll=async()=>{throw Error('unsupported')};eq(await sharing.allowed(),false);
  const chromium=L.sharing({runtime:{getManifest:()=>({})}});eq(chromium.optional,false);eq(await chromium.allowed(),true);eq(await chromium.request(),true);
  console.log(checks+' release import-safety and Firefox consent checks passed');
}
consent().catch(error=>{console.error(error);process.exitCode=1;});
