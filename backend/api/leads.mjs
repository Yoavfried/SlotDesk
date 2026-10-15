import {neon} from '@neondatabase/serverless';
import {createIntake} from '../intake.mjs';
let handler;
export default {fetch(request){
  if(!process.env.DATABASE_URL||!process.env.SLOTDESK_ORIGIN)return new Response(null,{status:503,headers:{'Cache-Control':'no-store'}});
  if(!handler){const sql=neon(process.env.DATABASE_URL);handler=createIntake({origin:process.env.SLOTDESK_ORIGIN,insert:({email,name,timezone,onboarded_at,updates_opt_in})=>sql`INSERT INTO public.leads (email,name,timezone,onboarded_at,updates_opt_in) VALUES (${email},${name},${timezone},${onboarded_at},${updates_opt_in}) ON CONFLICT DO NOTHING`});}
  return handler(request);
}};
