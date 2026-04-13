Updated files:
- apply.html
- js/apply-form.js

This version includes:
- Step 1 meet-location checklist
- Which part of Berlin moved to Step 3
- New age-range bands
- Expanded gender options
- Man/Woman suboptions (Man/Cis-Man/Trans-Man and Woman/Cis-Woman/Trans-Woman)
- Identity page disclaimer link
- 0% note on intention totals
- Step 3 dropdown/checkbox updates requested by user

Important:
- Paste your deployed Google Apps Script /exec URL into js/apply-form.js
- This frontend now submits these key fields:
  genderIdentity
  interestedIn
  preferredMeetingType
  berlinArea
  conversationStyle
  eveningVibeCombined
  preferredAgeRangesCombined
  interestsCombined
  musicGenresCombined
  opennessCombined

If your Apps Script currently uses older field names only, you may want to update Code.gs later so the new fields are written into the sheet as separate columns.
