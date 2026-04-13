const SHEET_NAME = 'Applications';
const ADMIN_EMAIL = 'YOUR_EMAIL_HERE@example.com';

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  const headers = getHeaders();
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
  return sheet;
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    ensureHeaders(sheet);

    const data = (e && e.parameter) ? e.parameter : {};
    const timestamp = new Date();

    const normalizedGenderIdentity = data.genderIdentity === 'Prefer to self-describe'
      ? [data.genderIdentity || '', data.genderSelfDescribe || ''].filter(Boolean).join(': ')
      : safe(data.genderIdentity);

    const source = safe(data.source) || safe(data.utm_source) || 'direct';
    const fullName = [safe(data.firstName), safe(data.lastName)].filter(Boolean).join(' ');
    const interestedIn = joinValues(data.interestedIn);
    const preferredAgeRanges = joinValues(data.preferredAgeRanges);
    const interests = joinValues(data.interests);
    const musicGenres = joinValues(data.musicGenres);

    const row = [
      timestamp,
      safe(data.eventName),
      safe(data.firstName),
      safe(data.lastName),
      fullName,
      safe(data.email),
      safe(data.ageRange),
      safe(data.bio),
      safe(data.stayInBerlin),
      safe(data.languagePriority1),
      safe(data.languagePriority2),
      safe(data.languagePriority3),
      safe(data.preferredMeetingArea),
      safe(data.referredByName),
      safe(data.referredByEmail),
      normalizedGenderIdentity,
      interestedIn,
      safe(data.intentionLongTerm),
      safe(data.intentionCasual),
      safe(data.intentionFriends),
      safe(data.relationshipStyle),
      safe(data.conversationStyle),
      safe(data.eveningVibe),
      preferredAgeRanges,
      interests,
      musicGenres,
      safe(data.openness),
      safe(data.avoid),
      safe(data.mustHave),
      safe(data.anythingElse),
      safe(data.eventSlug),
      safe(data.source_id),
      safe(data.utm_source),
      safe(data.utm_medium),
      safe(data.utm_campaign),
      safe(data.ref),
      safe(data.landing_page_url),
      safe(data.user_agent),
      source
    ];

    sheet.appendRow(row);

    sendApplicantConfirmationEmail(data);
    sendAdminNotificationEmail(data, source, fullName, interestedIn, preferredAgeRanges, interests, musicGenres, normalizedGenderIdentity);

    return jsonResponse({
      success: true,
      message: 'Application stored successfully'
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      message: error.message
    });
  }
}

function getHeaders() {
  return [
    'Timestamp',
    'Event Name',
    'First Name',
    'Last Name',
    'Full Name',
    'Email',
    'Age Range',
    'Bio',
    'Will Stay In Berlin Next 6 Months',
    'Language Priority 1',
    'Language Priority 2',
    'Language Priority 3',
    'Preferred Meeting Area',
    'Referred By Name',
    'Referred By Email',
    'Gender Identity',
    'Interested In',
    'Main Intention - Long-term Relationship',
    'Main Intention - Casual Dating',
    'Main Intention - Friends / Social',
    'Relationship Style',
    'Conversation Style',
    'Ideal Evening Vibe',
    'Preferred Age Range(s)',
    'Interests (up to 3)',
    'Music Genres (up to 3)',
    'Openness Around Dating & Intimacy',
    'Avoid',
    'Must-have',
    'Anything Else',
    'Event Slug',
    'Source ID',
    'UTM Source',
    'UTM Medium',
    'UTM Campaign',
    'Ref',
    'Landing Page URL',
    'User Agent',
    'Source'
  ];
}

function ensureHeaders(sheet) {
  const headers = getHeaders();
  const existing = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const existingJoined = existing.join('|').trim();
  const targetJoined = headers.join('|');

  if (existingJoined !== targetJoined) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function safe(value) {
  return value == null ? '' : String(value).trim();
}

function joinValues(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(', ');
  }
  return safe(value);
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendApplicantConfirmationEmail(data) {
  const email = safe(data.email);
  if (!email) return;

  const firstName = safe(data.firstName) || 'there';
  const eventName = safe(data.eventName) || 'our event';

  const subject = `We received your application for ${eventName}`;
  const body = `Hi ${firstName},

Thanks for applying for ${eventName}.

We received your application successfully and will review it soon.

This confirmation only means that we received your application — it does not yet confirm a spot.

If you need to update anything, you can reply to this email.

Love,
Duck Dating Apps`;

  GmailApp.sendEmail(email, subject, body, {
    name: 'Duck Dating Apps'
  });
}

function sendAdminNotificationEmail(data, source, fullName, interestedIn, preferredAgeRanges, interests, musicGenres, normalizedGenderIdentity) {
  const adminEmail = ADMIN_EMAIL;
  if (!adminEmail || adminEmail.indexOf('@') === -1) return;

  const subject = `New application: ${safe(data.eventName) || 'Event'}`;
  const body = `A new application has been submitted.

Event: ${safe(data.eventName)}
Event slug: ${safe(data.eventSlug)}
Name: ${fullName}
Email: ${safe(data.email)}
Age range: ${safe(data.ageRange)}
Bio: ${safe(data.bio)}
Staying in Berlin 6 months: ${safe(data.stayInBerlin)}
Language priority 1: ${safe(data.languagePriority1)}
Language priority 2: ${safe(data.languagePriority2)}
Language priority 3: ${safe(data.languagePriority3)}
Preferred meeting area: ${safe(data.preferredMeetingArea)}
Referred by name: ${safe(data.referredByName)}
Referred by email: ${safe(data.referredByEmail)}
Gender identity: ${normalizedGenderIdentity}
Interested in: ${interestedIn}
Long-term relationship: ${safe(data.intentionLongTerm)}%
Casual dating: ${safe(data.intentionCasual)}%
Friends / social: ${safe(data.intentionFriends)}%
Relationship style: ${safe(data.relationshipStyle)}
Conversation style: ${safe(data.conversationStyle)}
Ideal evening vibe: ${safe(data.eveningVibe)}
Preferred age range(s): ${preferredAgeRanges}
Interests: ${interests}
Music genres: ${musicGenres}
Openness: ${safe(data.openness)}
Avoid: ${safe(data.avoid)}
Must-have: ${safe(data.mustHave)}
Anything else: ${safe(data.anythingElse)}
Source: ${source}
Source ID: ${safe(data.source_id)}
UTM source: ${safe(data.utm_source)}
UTM medium: ${safe(data.utm_medium)}
UTM campaign: ${safe(data.utm_campaign)}
Ref: ${safe(data.ref)}
Landing page URL: ${safe(data.landing_page_url)}
User agent: ${safe(data.user_agent)}`;

  GmailApp.sendEmail(adminEmail, subject, body, {
    name: 'Duck Dating Apps Form Bot'
  });
}
