# Decisions before publication

- Review the legal controller/company name, privacy contact and jurisdictions.
  The source-confirmed general email is arotec@arotec-group.com; delivery and its
  suitability as a privacy contact have not been verified by sending a message.
- Confirm the factual policy and Google Fonts/provider disclosures, legal bases,
  hosting/provider logs and retention. No compliance guarantee is made.
- Review localized metadata and terminology, and existing scientific/content
  statements carried forward from the catalogs. No new efficacy claims are added.
- Decide whether to retain external Google font requests or license/self-host
  equivalent Noto faces. Local Noto faces were absent; existing fonts were kept
  to preserve actual Thai/Japanese/Chinese typography.
- Approve a real contact-form delivery architecture separately if wanted.
  GitHub Pages cannot serve the current same-origin Python API. The pilot uses
  email fallback and does not imply successful form delivery.
- Decide how the new locale URLs should be linked from legacy original pages,
  and the canonical/redirect transition for those duplicates. This pilot is
  additive and leaves the originals untouched to preserve pending local work.
- Approve new SEO/cookie publication separately after reviewing local results.
  Nothing here changes DNS/domain/CNAME, future-domain canonicals, access controls,
  backend services, plans, payments or tracking. The circle publication is a
  separate approval-blocked change and is not included in a release here.

Official guidance consulted (implementation reference, not a legal conclusion):
ICO storage/access consent and exceptions guidance; Thai PDPC cookie-banner guide.
https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/how-do-we-manage-consent-in-practice/
https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/
https://gppc.pdpc.or.th/wp-content/uploads/คู่มือการออกแบบและการใช้งานคุกกี้แบนเนอร์.pdf
