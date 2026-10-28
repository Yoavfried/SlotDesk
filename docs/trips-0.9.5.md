# Trips and flights

Open **Travel & flights** from Manage profiles, or use the flight icon beside a saved meeting participant. The manager lists that person’s saved trips and provides **Add trip**.

## Add a trip

1. Check **From city**. SlotDesk prefills the profile’s selected city, or the identifiable city in its current timezone. You can choose another city.
2. Select **To city** and enter the **Departure date** and **Departure time**. The clock uses the departure city’s timezone.
3. For a connecting journey, select **Connection flight**, choose the connection city and enter the second departure date/time in that city’s local time. The destination remains the final city. Further connections can be added.
4. Review the arrival shown for each flight. SlotDesk calculates it; no arrival date/time or timezone entry is required.
5. Add further flights or **Flight back** if needed. Flight back prefills the recorded trip origin.
6. **Save** checks unlinked flights against the profile’s linked calendars, then stores the complete trip and returns to the list. **Discard** leaves the saved trip unchanged. Unfinished forms are not kept as resumable drafts.

City choices retain coordinates and timezone metadata. San Francisco and Los Angeles remain different routes even though they share a timezone. If a profile has only UTC or an ambiguous location, select an actual departure city before saving.

## Arrival calculation and calendar matching

Entering or changing cities and dates updates the local estimate without reading calendars. On **Save**, SlotDesk checks flights that have not already been identified against the profile’s linked workspace calendars around their departure dates. A clear matching route and departure can supply recorded flight times. Multiple or uncertain matches require selection, or you can keep the estimated flight without linking it. A matching entry is linked inside SlotDesk; the calendar appointment is unchanged.

When no matching event supplies arrival, SlotDesk estimates duration from the selected cities’ geographic distance, using an 800 km/h cruise allowance plus 45 minutes, rounded up to five minutes with a 45-minute minimum. This is a geographic estimate, not an airline timetable or live flight-status service. The arrival summary identifies estimated times.

Duration is added to the actual departure instant, then converted to the destination’s local clock. This handles date changes, daylight-saving changes and the international date line. A nonexistent departure clock time must be corrected; a repeated departure time requires selecting its clock occurrence. Calculated arrivals do not require a second clock-occurrence choice.

A connection’s departure must be after the preceding arrival. Saving never silently moves a departure to accommodate an estimated duration.

## Add from calendar

Use **Add from calendar** inside the trip editor to choose an appointment manually. Choose dates and calendars, then select the appointment to return to the form. The picker starts with the profile’s linked calendars; other selected workspace calendars are available.

Manual selection works with Event detection off and does not require a flight keyword. SlotDesk uses the appointment’s recorded times and checks its title, location and description for identifiable airport codes or city routes. Missing cities or departure details remain for you to complete. An all-day entry supplies its date, but does not establish exact flight times.

The picker identifies appointments already saved as flights for this profile. Saving also checks for duplicate calendar links, shared event copies and matching saved routes/departures. Flight detection avoids suggesting flights that are already saved.

## Scheduling and timezone changes

- Each departure-to-arrival interval blocks meetings.
- At a connection, 30 minutes after arrival and 30 minutes before departure are blocked. A longer layover’s remaining gap can be used for meetings under the profile’s other rules.
- The first departure and final arrival have two-hour inconvenience buffers.
- A destination timezone takes effect on arrival. Active-trip transitions control scheduling until the trip’s final arrival, without changing the timezone field displayed in Edit profile during the trip.
- A trip ending without a return flight changes the saved profile timezone to its final destination on arrival. The editor explains this before saving.
- Manual profile timezone changes after the final arrival take priority. A return trip does not automatically replace the saved base timezone.

## Changes, alerts and deletion

Changed, cancelled, deleted or inaccessible linked calendar flights appear in Alerts. Saved trip details remain until reviewed and confirmed; inaccessible data is not treated as a cancellation. With Event detection enabled, possible flights can open the same Add trip flow with known details prefilled.

Editing or deleting a trip affects SlotDesk’s saved trip rules, blockers and timezone transitions. It does not edit, cancel or delete calendar appointments. Deleting a completed one-way trip does not revert a saved profile timezone that was already updated by its final arrival.

The bundled city/airport data and geographic calculation work without a paid flight API. Dataset attribution is included in the extension.
