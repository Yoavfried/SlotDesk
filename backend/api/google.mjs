import {neon} from '@neondatabase/serverless';
import {createGoogleBroker} from '../google-auth.mjs';
import {createIntake} from '../intake.mjs';
import {insertLead} from '../insert-lead.mjs';

let handler,registration;
export default {fetch(request) {
  if(!handler) {
    let returnUrls=[];try{returnUrls=JSON.parse(process.env.SLOTDESK_AUTH_RETURN_URLS || '[]');}catch{}
    handler=createGoogleBroker({clientId:process.env.GOOGLE_WEB_CLIENT_ID,clientSecret:process.env.GOOGLE_WEB_CLIENT_SECRET,
      secret:process.env.SLOTDESK_AUTH_SECRET,callbackUrl:'https://slotdesk-leads.vercel.app/api/google?op=callback',
      returnUrls:Array.isArray(returnUrls)?returnUrls:[],register:async record=>{
        if(!process.env.DATABASE_URL || !process.env.SLOTDESK_ORIGIN)return new Response(null,{status:503});
        if(!registration){const sql=neon(process.env.DATABASE_URL);registration=createIntake({origin:process.env.SLOTDESK_ORIGIN,
          insert:insertLead(sql)});}
        return registration(new Request('https://slotdesk-leads.vercel.app/api/leads',{method:'POST',
          headers:{Origin:process.env.SLOTDESK_ORIGIN,'Content-Type':'application/json'},body:JSON.stringify(record)}));
      }});
  }
  return handler(request);
}};
