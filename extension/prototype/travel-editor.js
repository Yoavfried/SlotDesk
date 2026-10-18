(function(root){
  'use strict';
  root.SlotTravelEditor={create({context,save,timezoneOptions,format,escape:esc}){
    const C=SlotProfileConfiguration,U=SlotWorkspace,dialog=document.getElementById('travel-editor'),body=document.getElementById('travel-form-body'),form=document.getElementById('travel-form'),error=document.getElementById('travel-error'),warning=document.getElementById('travel-warning'),saveButton=document.getElementById('travel-save');
    let kind=null,index=-1,profile=null,original=null,returnTouched=new Set(),warningKey='';
    const read=section=>Object.fromEntries([...body.querySelectorAll('[data-section="'+section+'"] [data-field]')].map(el=>[el.dataset.field,el.hasAttribute('data-clock')?U.parseClock(el.value):el.value]));
    function fields(section,values,title){return '<fieldset data-section="'+section+'"><legend>'+title+'</legend><label>Label (optional)<input data-field="label" value="'+esc(values.label)+'"></label>'+['departure','arrival'].map(side=>'<h3>'+ (side==='departure'?'Departure':'Arrival')+'</h3><div class="form-grid"><label>Location (optional)<input data-field="'+side+'Location" value="'+esc(values[side+'Location'])+'" placeholder="City or airport"></label><label>Date<input data-field="'+side+'Date" type="date" value="'+esc(values[side+'Date'])+'" required></label><label>Time<input data-field="'+side+'Time" data-clock value="'+esc(values[side+'Time'])+'" required></label><label>Timezone<select aria-label="'+(section==='return'?'Return flight ':'Flight ')+side+' timezone" data-field="'+side+'Zone" required>'+timezoneOptions(values[side+'Zone'])+'</select></label><div data-occurrence="'+side+'" class="span-all"></div></div>').join('')+'</fieldset>';}
    function open(type,person,at=-1,prefill={}){
      kind=type;index=at;profile=C.clone(person);original=at>=0?C.clone(person[type][at]):null;returnTouched=new Set();warningKey='';error.textContent='';warning.textContent='';warning.hidden=true;saveButton.disabled=false;
      document.getElementById('travel-editor-title').textContent=(at<0?'Add ':'Edit ')+(type==='flights'?'flight':'travel dates')+' · '+(person.name||person.email);
      if(type==='flights'){
        const values=original?{...U.flightFields(original,person.tz,''),departureLocation:original.departureLocation||'',arrivalLocation:original.arrivalLocation||''}:{label:'',departureZone:person.tz,arrivalZone:person.tz,departureDate:'',arrivalDate:'',departureTime:'',arrivalTime:'',...prefill};
        body.innerHTML='<p class="muted">The flight is protected. Two hours around departure and arrival are inconvenient.</p>'+fields('outbound',values,'Flight')+(at<0?'<label class="check"><input id="return-flight" type="checkbox">Return flight</label><div id="return-flight-fields" hidden></div>':'');
        const toggle=document.getElementById('return-flight');if(toggle)toggle.onchange=()=>{const target=document.getElementById('return-flight-fields');if(!target.children.length)target.innerHTML=fields('return',C.returnFields(read('outbound')),'Return flight');target.hidden=!toggle.checked;target.querySelectorAll('input,select').forEach(el=>el.disabled=!toggle.checked);format(target);};
      }else{const values=original||{label:'',from:'',to:'',tz:person.tz,...prefill};body.innerHTML='<p class="muted">Both dates are included. These dates set this person’s local timezone for scheduling.</p><fieldset data-section="trip"><legend>Travel dates</legend><label>Label (optional)<input data-field="label" value="'+esc(values.label)+'"></label><div class="form-grid"><label>First date<input data-field="from" type="date" value="'+esc(values.from)+'" required></label><label>Last date<input data-field="to" type="date" value="'+esc(values.to)+'" required></label><label class="span-all">Destination timezone<select data-field="tz" required>'+timezoneOptions(values.tz)+'</select></label></div></fieldset>';}
      format(body);dialog.showModal();dialog.querySelector('.dialog-body').scrollTop=0;body.querySelector('input')?.focus();
    }
    function returnPrefill(event){if(!event.target.matches('[data-field]'))return;const part=event.target.closest('[data-section]');if(part?.dataset.section==='return')returnTouched.add(event.target.dataset.field);if(part?.dataset.section==='outbound'&&document.getElementById('return-flight-fields')?.children.length){const values=C.returnFields(read('outbound'));for(const key of ['departureLocation','arrivalLocation','departureZone','arrivalZone'])if(!returnTouched.has(key)){const el=body.querySelector('[data-section="return"] [data-field="'+key+'"]');el.value=values[key];if(el.tagName==='SELECT')SlotTimezonePicker.refresh(el);}}}
    body.addEventListener('input',returnPrefill);body.addEventListener('change',returnPrefill);
    function occurrence(section,err){const target=body.querySelector('[data-section="'+section+'"] [data-occurrence="'+err.side+'"]');if(!target)return;target.innerHTML='<label>This local time occurs twice. Choose one<select data-field="'+err.side+'Instant" required><option value="">Choose an occurrence</option>'+err.candidates.sort((a,b)=>a-b).map((value,i)=>'<option value="'+new Date(value).toISOString()+'">'+(i?'Later':'Earlier')+' · '+new Date(value).toISOString().replace('T',' ').replace('.000Z',' UTC')+'</option>').join('')+'</select></label>';target.querySelector('select').focus();}
    form.onsubmit=async event=>{event.preventDefault();error.textContent='';let entries;
      try{const current=context();if(!current||current.id!==profile.id)throw new Error('This profile is no longer open. Discard this form and reopen the profile.');if(kind==='flights'){
          let first,back;try{first=C.flight(read('outbound'),original||{});}catch(err){if(err.candidates)occurrence('outbound',err);throw err;}
          if(document.getElementById('return-flight')?.checked)try{back=C.flight(read('return'));}catch(err){if(err.candidates)occurrence('return',err);throw err;}
          if(back&&Date.parse(back.departure)<Date.parse(first.arrival))throw new Error('The return flight must depart after the outbound flight arrives.');entries=back?[first,back]:[first];
          const notices=C.flightWarnings(entries,(current.flights||[]).filter((_,i)=>i!==index),original?.id),key=JSON.stringify(entries.map(f=>[f.departure,f.arrival]));if(notices.length&&warningKey!==key){warningKey=key;warning.textContent=notices.join(' ')+' Select Save again to keep these entries.';warning.hidden=false;return;}
        }else entries=[read('trip')];
        const next=[...(profile[kind]||[])];if(index>=0)next.splice(index,1,...entries);else next.push(...entries);C.checkProfile({...current,[kind]:next});saveButton.disabled=true;
        if(!await save(kind,next,profile[kind]||[]))throw new Error('Could not save. Your form is still open; try again.');dialog.close();reset();
      }catch(err){error.textContent=err.message;saveButton.disabled=false;}
    };
    function reset(){kind=null;profile=null;original=null;body.replaceChildren();returnTouched.clear();}
    document.getElementById('travel-discard').onclick=()=>{dialog.close();reset();};
    // Only Save/Discard end a travel form. Pickers handle their own Escape first.
    dialog.addEventListener('cancel',event=>event.preventDefault());
    return {open,reset:()=>{dialog.close();reset();},isOpen:()=>dialog.open};
  }};
})(typeof self!=='undefined'?self:this);
