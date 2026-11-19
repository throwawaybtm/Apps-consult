# Simantab Nongsa: the look reference

Source: https://www.simantabnongsa.id/ (fetched 2026-11-19: HTML plus `styles/simantab.css`, `styles/_tail_home.css`, `styles/sichart.css`). **Read from source, not seen rendered**; no screenshot was taken, so visual details (spacing, imagery, hero artwork) are unverified.

## What it is

SIMANTAB NONGSA, "Sistem Informasi Ketentraman dan Ketertiban", the public complaint and information site of the Seksi Trantib, Kecamatan Nongsa, Kota Batam. It is **not** a lending system. Only its look and public-page pattern are relevant to e-BLUD.

## Structure

Single page with anchored sections: Beranda, Profil, Tentang, Berita, Laporan, Tracking, Galeri, Kontak. Top navigation repeats the same seven links plus Beranda.

Beranda: a hero with a short badge, the system name, subtitle and two calls to action ("Laporkan Pengaduan", "Lacak Laporan"); then live stat cards (total, followed up, resolved), a monthly trend chart, a category chart and a "Top 5 locations" chart. Profil has district facts (area, population, number of kelurahan, density), head of district, vision and mission. Tracking: enter a code and see handling progress. News with categories and a share dialog. Gallery uses a slider. Contact section closes the page.

## Visual tokens (from CSS and Tailwind classes)

| Token | Value |
|---|---|
| Primary | Tailwind sky: `sky-600` buttons and links, `sky-700` hover and bars, `sky-900` headings |
| Backgrounds | `sky-50`, `sky-100` washes, white cards; gradients `from-sky-50` |
| Accents | green 500–900 (success), orange (warning), red (error), purple (category tints) |
| Neutrals | grays `#374151`, `#6b7280`, `#e5e7eb`, `#f3f4f6` |
| Font | Inter 300–800 (Google Fonts); system stack fallback |
| Radius | 0.5rem on controls, 10–15px on cards, pills for badges |
| Icons | Font Awesome 6.5 |
| Libraries | Tailwind via CDN, Chart.js 4.4, Swiper 11 |

## Pattern worth reusing for e-BLUD's public site

- One calm blue palette, one typeface, generous white space, large rounded cards.
- A hero with two clear actions.
- Aggregate numbers and charts shown publicly, no individual records.
- A tracking code lookup so a citizen can see progress without logging in.

## Cautions

- It loads Tailwind from a CDN at runtime and many third-party scripts. e-BLUD's mockups should not depend on a CDN for layout; only the charts load a library.
- Colours were taken from class names and CSS, not checked for contrast. The mockups must pass WCAG 2.2 AA on their own.
- Do not copy its name, logo, text or imagery.
