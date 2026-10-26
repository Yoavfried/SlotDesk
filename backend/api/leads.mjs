import {neon} from '@neondatabase/serverless';
import {createIntake} from '../intake.mjs';
import {insertLead} from '../insert-lead.mjs';
let handler;
export default {fetch(request){
  if(!process.env.DATABASE_URL||!process.env.SLOTDESK_ORIGIN)return new Response(null,{status:503,headers:{'Cache-Control':'no-store'}});
  if(!handler){const sql=neon(process.env.DATABASE_URL);handler=createIntake({origin:process.env.SLOTDESK_ORIGIN,insert:insertLead(sql)});}
  return handler(request);
}};
