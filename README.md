# Northern Access Floors Ltd — Website

Static website: plain HTML, CSS and JavaScript. No build step, no server-side
dependencies. Upload the contents of this folder to the web root of any
standard web host and it will work as-is.

## Structure

| Path | Purpose |
|---|---|
| `index.html` | Home |
| `about.html` | About NAFL |
| `raised-access-flooring.html` | Service — Raised Access Flooring |
| `data-centre-flooring.html` | Service — Data Centre Flooring |
| `commercial-offices.html` | Service — Commercial Offices |
| `projects.html` | Projects portfolio with sector filtering |
| `project-template.html` | Case-study template — copy per project (e.g. `project-leeds-office.html`) and fill in the bracketed text |
| `health-safety.html` | Health & Safety + policy downloads |
| `careers.html` | Careers + CV submission form |
| `contact.html` | Contact page with enquiry/drawing-upload form |
| `css/style.css` | Single sitewide stylesheet |
| `js/main.js` | Mobile nav, project filters, form placeholder handler |
| `images/` | Image assets (currently labelled placeholders) |
| `downloads/` | Put policy/certificate PDFs here (currently empty) |

## Before go-live — action list

1. **Homepage hero (photo or video)** — the hero is a full-bleed banner.
   Today it shows `images/placeholder-hero-banner.svg`. To use a real photo,
   save it as a wide JPG (1920×1080, under ~500 KB) and update the `<img>` in
   `index.html`. To use a **video** instead, follow the comment inside the
   `<div class="hero-media">` block in `index.html`: drop `videos/hero.mp4`
   (H.264, 10–20s loop, muted, under ~8 MB) plus `images/hero-poster.jpg`
   and swap the `<img>` for the ready-made `<video>` snippet. The navy
   overlay keeps the headline readable over any footage, and the site
   automatically pauses the video for users with reduced-motion enabled.
2. **Photos** — every `images/placeholder-*.svg` is a labelled placeholder.
   Replace by either (a) saving the real photo over the same filename path and
   updating the `src`/extension in the HTML, or (b) keeping it simplest:
   save real photos as JPGs in `images/` and search-and-replace the
   placeholder filename in the HTML files. Each placeholder is labelled with
   the photo it expects. Recommended size ~1200×900px, JPG, under 400 KB.
2. **Logo** — the header uses `images/logo.svg`, an SVG recreation of the
   company logo. If the official vector or high-res logo file is supplied,
   save it over that same path (or drop in a PNG and update the `src` in
   each page's header) — no other changes needed.
3. **Forms** (contact + careers) — these are front-end only. They currently
   show a polite placeholder message on submit (`data-placeholder` attribute
   in the `<form>` tag). To activate: point the form `action` at your form
   handler (host form-mail script, or a service such as Formspree / a small
   PHP mailer) and delete the `data-placeholder` attribute. Note both forms
   include **file uploads** (drawings / CVs), so the handler must accept
   `multipart/form-data` attachments.
4. **Email address** — `info@nafl.co.uk` is used throughout as a best guess.
   Confirm the correct address and search-and-replace if different.
5. **Downloads** — drop the four PDFs into `/downloads/` matching the
   filenames linked from `health-safety.html` (health-safety-policy.pdf,
   environmental-policy.pdf, insurance-certificates.pdf,
   accreditation-certificates.pdf), or update the links.
6. **Projects** — the seven cards on `projects.html` are samples. For each
   real project: copy `project-template.html`, fill in the bracketed fields,
   and point the matching card's link at the new file. The card's
   `data-sector` attribute controls which filter button shows it
   (commercial / datacentre / education / healthcare / government /
   industrial / refurbishment).
7. **Favicon** — none included yet; add a `favicon.ico` to the web root when
   the logo is available.

## SEO

Each page carries the specified SEO title and meta description. Once the
domain is confirmed, consider adding canonical URLs and a `sitemap.xml`.
