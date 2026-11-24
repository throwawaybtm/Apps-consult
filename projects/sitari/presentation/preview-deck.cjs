#!/usr/bin/env node
// Local preview of the deck (approximation of the Slides renderer): one PNG per slide in OUT.
// Maps /_blob/<id> back to assets/*.webp using the table in README.md.
'use strict';
const fs = require('node:fs'), path = require('node:path'), { chromium } = require('playwright');
const OUT = process.argv[2]; if (!OUT) throw new Error('usage: preview-deck.cjs <out-dir> [slide-id ...]');
const deck = path.join(__dirname, 'deck/project');
const idx = JSON.parse(fs.readFileSync(path.join(deck, 'deck.json'), 'utf8'));
const map = Object.fromEntries([...fs.readFileSync(path.join(__dirname, 'README.md'), 'utf8').matchAll(/`([0-9a-f]{32})` \| `assets\/([^`]+)`/g)].map(m => [m[1], m[2]]));
const css = fs.readFileSync(path.join(deck, 'deck.css'), 'utf8');
const only = process.argv.slice(3);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const id of idx.order) {
    if (only.length && !only.includes(id)) continue;
    let html = fs.readFileSync(path.join(deck, 'slides', id + '.html'), 'utf8').replace(/<aside>[\s\S]*?<\/aside>/, '');
    html = html.replace(/\/_blob\/([0-9a-f]{32})/g, (m, h) => 'file://' + path.join(__dirname, 'assets', map[h] || 'missing'));
    html = html.replace(/<section /, '<section style="position:relative;width:1920px;height:1080px;overflow:hidden" ');
    const tmp = path.join(OUT, id + '.html');
    fs.writeFileSync(tmp, `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>${id}</title><link rel="stylesheet" href="${idx.faces['plus-jakarta-sans'].href}"><style>body{margin:0}${css}.in{animation:none}</style></head><body>${html}</body></html>`);
    await p.goto('file://' + tmp, { waitUntil: 'networkidle' });
    const over = await p.evaluate(() => [...document.querySelectorAll('section *')].filter(e => { const r = e.getBoundingClientRect(); return r.bottom > 1080 || r.right > 1920; }).map(e => e.tagName + '.' + e.className).slice(0, 3));
    await p.screenshot({ path: path.join(OUT, id + '.png') });
    console.log(id, over.length ? 'OVERFLOW ' + over.join(',') : 'ok');
  }
  await b.close();
})();
