# Recruitment / Join Us

## Pages

- Public page: /pages/join-us.html
- Admin page: /pages/careers-admin.html
- The Join Us main-menu item links to the public page.

## Enable the feature

1. Run the existing Python backend with the project's existing requirements.
2. Keep the existing AROTEC_ADMIN_PASSWORD environment variable configured. No new account or default password is created.
3. Restart server.py after deployment. New recruitment tables are created automatically during startup.
4. Open the admin page through that backend, sign in with the existing admin password, review the three reference drafts, and publish the positions that should appear publicly.

For the existing local setup, the backend's normal command is:

    python server.py

The existing AROTEC_PORT / PORT, AROTEC_HOST and DATABASE_URL settings still apply.
No new Python package is required.

## Data storage

The feature uses the same connect_db() configuration as the existing application:

- DATABASE_URL configured: PostgreSQL.
- Otherwise: database/members.sqlite.

Tables: career_meta, career_jobs, career_applications, career_files.
Resume and portfolio PDFs are stored as private BLOB/BYTEA values in career_files.
There are no public upload URLs or uploaded files under assets/.
Applications retain a snapshot of the position title so later edits do not rewrite application history.
SQLite storage needs a persistent disk. On hosts with ephemeral local filesystems, use the existing persistent PostgreSQL database instead.

## Positions and applications

- Draft: visible only to admins.
- Published: visible on Join Us and selectable on the application form.
- Closed: hidden from new applicants; existing applications are retained.
- The three positions from the supplied image are seeded once as drafts, not live vacancies.
- Admins can create and edit positions, search and paginate applications, read applicant information,
  download documents, update review status, and keep internal notes.
- The position editor includes a live card preview and publication guidance. The position list shows
  saved publication counts, locations, employment type, and experience. Preview edits remain local until saved.
- Applicant details distinguish position applications from the general talent pool and show current
  country/location, preferred work locations, professional background, and both consent choices.
- Deleting an application requires an explicit confirmation and removes its documents as well.
- Future-opportunity consent is optional and stored separately from required recruitment consent.
- No automatic email, automatic candidate decisions, or bulk data deletion is configured.

## Upload limits

- Resume: one PDF, up to 10 MiB, required.
- Portfolio / supporting documents: one PDF, up to 20 MiB, optional.
- Total multipart request limit: 32 MiB.
- The server checks the extension, declared type, PDF signature, end marker, field lengths and request size.
- Repeated requests with the same submission key and content return the existing receipt instead of creating duplicate applications.
- Files are downloaded as attachments after admin authentication, never embedded as active PDF previews.

PDF signature checks are not antivirus scanning. Add a malware scanning service before operational use
if your organization requires it, and scan files before opening them. No file is sent to a third-party scanning service by this implementation.

## Security and deployment notes

- Existing admin password authentication is reused via Authorization: Bearer.
- The new admin UI keeps the password only in tab memory, not localStorage or sessionStorage.
- The UI signs out after 15 minutes without an API interaction.
- Public forms and admin sign-in require HTTPS, except on localhost.
- Deploy behind the existing HTTPS reverse proxy; preserve the original Host header for same-origin checks.
- Do not expose the development-style Python HTTP server directly to the public internet.
- Configure proxy request-size and timeout limits to accommodate a 32 MiB request.
- Upload concurrency is bounded. Basic rate limits use the network peer address and are process-local;
  behind a shared reverse proxy, add appropriate edge rate limits and review the effective client-IP policy.
- New private API responses are not cross-origin-enabled, and cross-site requests are rejected.
- SQL values are parameterized and user-authored text is rendered as plain text.
- Static serving now rejects database paths, dotfiles, non-public file extensions, directory listings,
  and symlinks resolving outside the workspace. This also applies to HEAD requests.
- Protected recruitment file downloads must go through the authenticated API, not a separate static file server.
- A generic static preview server is NOT the recruitment backend and must never expose the workspace's database or environment files.
- A static-only deployment cannot accept applications or run the admin API.
- Before collecting real applicant data, approve the recruitment privacy wording and retention policy,
  limit staff access to the shared admin credential, and configure secure database backups and deletion procedures.
- No production deployment, production backend restart, or live application submission was performed by the 2026-09-19 update.

## Verification

- On 2026-09-19, all five suites in `python tests/careers_http_integration.py` passed against an isolated
  temporary database. They cover page assets, draft seeding, authentication, position/application lifecycle,
  private PDF downloads, upload limits, consent validation, and cross-site/missing-configuration behavior.
- The image refresh and admin improvements do not migrate existing jobs, change saved publication
  statuses, or alter applicant records. The API contract and PDF limits remain the same.
- The Codex in-app browser was checked at 390, 820, 1045 and 1440 px. Position details, Apply now,
  general talent-pool selection, country selection, optional professional-background expansion,
  and View all positions (with four isolated test roles) worked without horizontal page overflow.
- A synthetic mobile application with two PDFs was submitted to an isolated QA database and verified
  in the admin UI, including all selected locations, professional background and both consent flags.
  A non-PDF upload was rejected; successful submission reset the form and displayed a receipt.
- Admin publication counts, unsaved card preview, publication action wording and mobile applicant
  detail were checked. Browser console inspection reported no errors or warnings on the tested pages.
- Visual evidence and known adaptations are recorded in `artifacts/join-us-20260919/design-qa.md`.

## API outline

Public:
- GET /api/careers/jobs
- POST /api/careers/applications (multipart/form-data)

Admin authentication required:
- GET /api/admin/careers/jobs
- POST /api/admin/careers/jobs
- PUT /api/admin/careers/jobs/{id}
- GET /api/admin/careers/applications?page=1&status=&q=
- GET /api/admin/careers/applications/{id}
- PUT /api/admin/careers/applications/{id}
- DELETE /api/admin/careers/applications/{id}
- GET /api/admin/careers/applications/{id}/files/resume
- GET /api/admin/careers/applications/{id}/files/portfolio
