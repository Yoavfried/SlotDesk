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
