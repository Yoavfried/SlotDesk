"""Build the local city/timezone index from GeoNames cities15000 and countryInfo."""
from pathlib import Path
import argparse, datetime, hashlib, json, re, unicodedata, zipfile

parser=argparse.ArgumentParser()
parser.add_argument('source',type=Path,help='Folder containing cities15000.zip, countryInfo.txt and timeZones.txt')
args=parser.parse_args()
root=Path(__file__).resolve().parent.parent
destination=root/'extension/data'
destination.mkdir(exist_ok=True)
def normalized(value):
    value=''.join(c for c in unicodedata.normalize('NFKD',value).lower() if not unicodedata.combining(c)).replace('ł','l').replace('ß','ss')
    return re.sub(r'[^a-z0-9]+',' ',value).strip()
countries=[];country_ids={}
for line in (args.source/'countryInfo.txt').read_text(encoding='utf-8').splitlines():
    if not line or line.startswith('#'):continue
    row=line.split('\t');country_ids[row[0]]=len(countries);countries.append([row[0],row[1],row[4]])
zones=[];zone_ids={};cities=[]
with zipfile.ZipFile(args.source/'cities15000.zip') as archive:
    for line in archive.read('cities15000.txt').decode('utf-8').splitlines():
        row=line.split('\t');zone=row[17];country=row[8]
        if not zone or country not in country_ids:continue
        if zone not in zone_ids:zone_ids[zone]=len(zones);zones.append(zone)
        names=[]
        for name in [row[1],row[2],*row[3].split(',')]:
            # Keep useful Latin spelling variants; primary Unicode names remain in labels.
            if len(name)>90:continue
            value=normalized(name)
            if value and value not in names and len(value.split())<=7:names.append(value)
        cities.append([zone_ids[zone],country_ids[country],row[1],'|'.join(names),int(row[14] or 0)])
country_zones=[]
for line in (args.source/'timeZones.txt').read_text(encoding='utf-8').splitlines()[1:]:
    row=line.split('\t')
    if len(row)<2 or row[0] not in country_ids:continue
    if row[1] not in zone_ids:zone_ids[row[1]]=len(zones);zones.append(row[1])
    country_zones.append([zone_ids[row[1]],country_ids[row[0]]])
cities.sort(key=lambda row:-row[4])
stamp=datetime.datetime.now(datetime.timezone.utc).date().isoformat()
data={'source':'GeoNames','snapshot':stamp,'zones':zones,'countries':countries,'countryZones':country_zones,'cities':cities}
payload=json.dumps(data,ensure_ascii=False,separators=(',',':'))
header='/* City/capital timezone search data adapted from GeoNames, CC BY 4.0. See GEONAMES-NOTICE.txt. */\n'
(destination/'timezone-search.js').write_text(header+"(function(root,data){if(typeof module==='object'&&module.exports)module.exports=data;else root.SlotTimezoneData=data;})(typeof self!=='undefined'?self:this,"+payload+");\n",encoding='utf-8')
hashes={name:hashlib.sha256((args.source/name).read_bytes()).hexdigest() for name in ['cities15000.zip','countryInfo.txt','timeZones.txt']}
notice=f'''Timezone search data

Contains information from GeoNames (https://www.geonames.org/), licensed under
Creative Commons Attribution 4.0: https://creativecommons.org/licenses/by/4.0/

Source: https://download.geonames.org/export/dump/
Snapshot downloaded: {stamp}
Adapted by SlotDesk: selected city names/spelling variants, countries, IANA
timezone references and population ordering, transformed into a local index.
No coordinates or user information are sent to GeoNames during searches.
The data is provided as is; browser timezone rules determine actual offsets.

Coverage: {len(cities):,} city records, {len(countries)} countries/territories,
{len(zones)} timezone identifiers. The cities15000 source includes capitals.

Source SHA256 checksums:
'''+''.join(f'{value}  {name}\n' for name,value in hashes.items())
(destination/'GEONAMES-NOTICE.txt').write_text(notice,encoding='utf-8')
print(f'Built {len(cities):,} city records, {len(countries)} countries, {len(zones)} zones; {len(payload.encode()):,} bytes.')
