# Get In Touch and inquiry administration

## Pages
- Public: /pages/get-in-touch.html
- Admin: /pages/contact-admin.html
- The shared Get In Touch menu opens the public page.
- Recruitment Admin includes a Contact inquiries shortcut.

## Existing backend
The contact API runs in server.py and reuses the existing database connection,
request protection helpers and AROTEC_ADMIN_PASSWORD. No additional package
is required. Restart the Python server after installing these files.

Without DATABASE_URL, records use database/members.sqlite. With DATABASE_URL,
they use the existing PostgreSQL database. Startup adds contact_inquiries and
its indexes without modifying membership or recruitment records.

The current local Windows admin password is stored in the user environment.
A newly opened terminal inherits it. For an already-open PowerShell session:
```powershell
$env:AROTEC_ADMIN_PASSWORD = [Environment]::GetEnvironmentVariable('AROTEC_ADMIN_PASSWORD', 'User')
```
Do not add passwords to JavaScript, HTML, source control or public files.

## Data and access
The form stores name, company, job title, email, country / region, area of
interest, help topic, message, consent version and timestamps. Admins can
search, paginate, read, record status and internal notes, and permanently
delete an inquiry after confirmation. There are no seeded inquiries.

Private data is returned only by authenticated admin endpoints. No applicant
or inquiry records are stored in browser localStorage. Admin credentials stay
in tab memory and expire after 15 minutes of inactivity.

Submissions use bounded JSON requests, server-side validation, same-origin
checks, a honeypot, rate limits and idempotency keys. Edits use optimistic
concurrency so an outdated screen cannot overwrite a newer change silently.

Submission confirmation is shown only after the database transaction commits.
No email notification or automatic reply is sent. The admin email action
opens the staff member's email client; changing status does not send mail.

## Routes
- GET /api/contact/status
- POST /api/contact/inquiries
- GET /api/admin/contact/inquiries?q=&status=&page=1
- GET /api/admin/contact/inquiries/{id}
- PUT /api/admin/contact/inquiries/{id}
- DELETE /api/admin/contact/inquiries/{id}

Admin endpoints require Authorization: Bearer with the existing admin password.
Public routes never disclose inquiry contents or lookup receipts.

## Deployment notes
Use HTTPS outside localhost and the Python backend, not file URLs or an
unprotected static preview server. Keep the database and environment private.
Configure a business-approved privacy and retention policy before production
use. Backups may retain deleted records; manage them under the same policy.
Rate limits are process-local and keyed to the network peer, so a production
reverse proxy should also apply appropriate request limits.

Images display only the relevant photographic regions of the supplied
reference. Headings, addresses and form text are independent HTML.

## Reference refresh compatibility (2026-09-19)

The refreshed Get In Touch layout uses the same nine inquiry fields: first
name, last name, company, job title, email, country / region, area of interest,
how we can help, and message. The six help-topic values remain unchanged.
Contact Admin already displays every field and supports search, status,
internal notes and email-client follow-up, so no admin UI or database migration
is required for this reference refresh. The existing consent requirement and
consent metadata remain in place.

An isolated loopback server with a temporary SQLite database verified submission,
all nine fields in admin detail, duplicate-submission handling, search/status
filtering, saved follow-up notes, stale-edit rejection and synthetic-record
deletion. Unauthenticated access, missing consent and invalid interest values
were rejected. The admin JavaScript syntax check also passed. No real inquiry
records were accessed or modified, and no email was sent. This verification does
not cover PostgreSQL or production deployment.

The browser verification on the isolated preview confirmed required-field and
consent validation, then saved synthetic inquiry `INQ-CC6D45E36AAA`. Admin
displayed all nine inquiry fields, including Thai message text and line breaks;
the In progress status and internal notes saved successfully, and sign-out
cleared the authenticated workspace. The admin detail dialog fit the 390 px
mobile viewport. Screenshots are in `artifacts/get-in-touch-20260919/`.
After verifying the synthetic reference and its test email, the inquiry was
deleted through the isolated preview's authenticated API; the same reference
returned zero matching records afterward. Cleanup and asset-path results are
in `artifacts/get-in-touch-update-20260919/`. All 23 directly referenced public
assets and the page font responded successfully from the preview server.

## Local verification (2026-09-09)

A synthetic inquiry was submitted through the local in-app browser and opened
through the admin UI using the existing administrator credential.

- Required fields and consent prevented an empty form submission.
- Submission returned a saved inquiry reference.
- Admin sign-in, search and detail display succeeded.
- Thai text survived the round trip; HTML-like message text stayed literal.
- Status and internal notes persisted after closing, refreshing and reopening.
- Unauthenticated admin API access returned HTTP 401.
- The synthetic inquiry was deleted through the authenticated API. Both the
  API and refreshed admin table reported no remaining matching test records.
- Sign-out hid the workspace and cleared private detail content.
- No browser console errors were reported during the tested workflow.

No customer records were modified and no email was sent. Automated regression
tests, desktop/mobile visual comparisons and PostgreSQL were not tested.
Production deployment is not included.

The shared Privacy Policy and Terms of Use links were removed after the user
confirmed that approved policy pages are not available. Restore these links
when approved policy content and its destination URLs are provided. No legal
policy text was created as part of this change.
