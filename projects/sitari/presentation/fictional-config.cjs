#!/usr/bin/env node
// Writes the SITARI clone's gitignored local config with FICTIONAL staff names.
// The repo's config templates carry real staff names as PIC examples; screenshots
// must never show them, so this replaces every PIC name before the preview starts.
// Only gitignored files in the local clone are written. Nothing is pushed anywhere.
//
// Usage: SITARI_DIR=/path/to/sitari-diskum-v3 node projects/sitari/presentation/fictional-config.cjs
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const SITARI_DIR = process.env.SITARI_DIR || '/home/user/throwawaybtm/sitari-diskum-v3';

// One fictional PIC per destination id. Phone numbers are fictional and never dialled:
// the local preview simulates WhatsApp and Fonnte is not configured.
const PICS = {
  'sekretariat-umpeg': 'Rina Wulandari, A.Md.',
  'sekretariat-perencanaan': 'Yusuf Pratama, S.Kom.',
  'sekretariat-keuangan': 'Sari Anggraini, S.E.',
  'pemberdayaan-koperasi': 'Dimas Saputra, S.E.',
  'pengawasan-koperasi': 'Lestari Handayani, S.Kom.',
  'pengembangan-mikro': 'Bayu Nugroho, S.E.',
  'kewirausahaan': 'Maya Kartika, S.E.',
  'plut-kumkm': 'Fajar Ramadhan, S.E.',
  'dana-bergulir': 'Nadia Puspita, S.E.'
};

function rewrite(templateRel, targetRel) {
  const template = fs.readFileSync(path.join(SITARI_DIR, 'config-templates', templateRel), 'utf8');
  let n = 0;
  const out = template.replace(/\{ id: '([a-z-]+)', bidang: ('[^']*'), pic: '[^']*', phone: '[^']*' \}/g, (m, id, bidang) => {
    if (!PICS[id]) throw new Error('No fictional PIC for ' + id);
    n++;
    const phone = '0812000000' + String(Object.keys(PICS).indexOf(id) + 10);
    return `{ id: '${id}', bidang: ${bidang}, pic: '${PICS[id]}', phone: '${phone}' }`;
  });
  if (!n || n % Object.keys(PICS).length) throw new Error(`${templateRel}: replaced ${n} PICs, expected a multiple of ${Object.keys(PICS).length}`);
  fs.writeFileSync(path.join(SITARI_DIR, targetRel), out);
  console.log(`wrote ${targetRel} (${n} fictional PICs)`);
}

rewrite('Admin/VisitPicContacts.js.example', 'Admin/VisitPicContacts.js');
rewrite('Tamu-FO/Destinations.js.example', 'Tamu-FO/Destinations.js');
rewrite('Tamu-Luar/Destinations.js.example', 'Tamu-Luar/Destinations.js');
rewrite('Admin/PublicIntake.js.example', 'Admin/PublicIntake.js');

// Make sure the gitignored copies stay untracked in the clone.
const { execFileSync } = require('node:child_process');
const tracked = execFileSync('git', ['-C', SITARI_DIR, 'status', '--porcelain'], { encoding: 'utf8' }).trim();
if (tracked) {
  console.error('SITARI clone has tracked changes; refusing to continue:\n' + tracked);
  process.exit(1);
}
console.log('SITARI clone: no tracked changes.');
module.exports = { PICS };
