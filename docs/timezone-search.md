# Timezone search

The shared timezone picker remains a closed list of browser-supported IANA timezone identifiers. Local search adds city names and spelling variants, capitals, countries/territories and common timezone names. It tolerates a single insertion, deletion, substitution or adjacent transposition in longer words. It does not guess a timezone from arbitrary unmatched text or silently change a saved timezone while typing.

Examples include San Francisco / san fransisco → America/Los_Angeles, Eastern / easterm → US Eastern, Mountain / mountian → US Mountain, Ottawa → America/Toronto and São Paulo → America/Sao_Paulo. Countries can return multiple zones; ambiguous abbreviations such as IST retain India, Israel and Ireland choices. The user selects the intended result. The stored value remains the IANA zone, so calendar dates use the browser’s actual DST/offset rules, not a fixed city offset.

## Data and attribution

The bundled 19 October 2026 snapshot adapts [GeoNames cities15000, countryInfo and timeZones](https://download.geonames.org/export/dump/) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Its [source description](https://download.geonames.org/export/dump/readme.txt) specifies populated places over 15,000 inhabitants or capitals. This snapshot contains 34,173 city records, 252 countries/territories and 418 source timezone identifiers; only supported dropdown choices are returned. Country-zone rows also cover regions without a large city. It is a broad lookup aid, not a promise that every settlement or abbreviation is unambiguous.

The [bundled notice](../extension/data/GEONAMES-NOTICE.txt) records attribution, transformation and source SHA256 hashes. Help exposes the notice, GeoNames and licence links. The application sends no search input to GeoNames or another geocoding service. The index adds about 3.2 MB of uncompressed local data and no runtime dependency, network permission or API key. Source-data downloads are build inputs outside the extension package.

## Rebuild

Download `cities15000.zip`, `countryInfo.txt` and `timeZones.txt` from the source directory into a local folder, preserving those filenames. From the repository root run:

```powershell
python scripts/build-timezone-data.py PATH_TO_DOWNLOADED_FILES
npm test
npm run check
```

The script uses only the Python standard library, preserves the visible primary city name, normalizes searchable aliases, groups records by source timezone/country and generates both the browser/Node data module and attribution notice. Review data changes and the resulting checks before publishing a new snapshot. Search is deterministic for a given data snapshot and browser timezone database.

The index does not provide holidays. A timezone does not identify which country’s holidays a person observes. Region-based holiday suggestions are [deferred](roadmap.md).

## Friendly display labels — 0.9.4.5 owner direction

Agreed 20 October 2026; moved from the original 0.9.5 plan to 0.9.4.5 with the new-meeting work. Planned, not implemented. Replace raw IANA identifiers in ordinary UI, selected fields, participant rows, copied summaries and planning emails with:

- **City, Country** outside the US: Paris, France; London, United Kingdom; Jerusalem, Israel.
- **City, State code** for US locations: Los Angeles, CA; San Francisco, CA; New York, NY.
- The selected simple name for non-city zones, such as **UTC**. Do not attach a fabricated city/country to UTC or display Etc/UTC. Fixed offsets, if offered, must preserve the correct sign/value rather than expose IANA's reversed-sign Etc/GMT syntax.

Keep real IANA identifiers internally for scheduling, DST/offset calculations and interoperable calendar requests. This is a display change, not a conversion to fixed offsets. Date-specific offsets can accompany meeting times where useful; do not repeat a redundant GMT+0 after the simple UTC choice. Search by city, country, accepted timezone names and existing identifiers must continue working.

Preserve the city actually selected where available. Choosing San Francisco must remain San Francisco, CA even though its scheduling timezone is America/Los_Angeles. Do not claim a timezone's representative city is the person's known physical location. Existing records that only store the IANA identifier can use its documented representative city until the user explicitly picks a city; never guess a different city from their email or calendar prose.

Current implementation gaps: the search dataset retains city/country but omits US state metadata, and saved profiles retain only the timezone identifier rather than the selected city's display identity. Implementation needs structured city/country/state metadata and a portable optional selected-location reference, with deterministic migration/fallback for old profiles, travel/flight timezone fields and imported files. Missing display metadata must not invalidate an otherwise valid timezone or change the scheduled instant. Add state data from the local build inputs and keep attribution/rebuild records accurate. Replacing underscores alone would not satisfy this direction.
