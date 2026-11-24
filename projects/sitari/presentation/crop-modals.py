"""Crops modal screenshots (assets/<name>.webp) to the white dialog, saved as assets/<name>-crop.webp."""
import pathlib, sys
from PIL import Image
d = pathlib.Path(__file__).parent / 'assets'
NAMES = ['visit-konfirmasi', 'visit-konfirmasi-bottom', 'visit-disposisi', 'visit-notifikasi', 'visit-kedatangan',
         'visit-sppd', 'visit-selesai', 'tdd-detail', 'presensi-qr', 'presensi-daftar', 'kalender-agenda', 'e-notula']
for n in NAMES:
    im = Image.open(d / f'{n}.webp').convert('RGB')
    w, h = im.size
    g = im.convert('L').point(lambda v: 255 if v >= 246 else 0)
    # only the middle band, so a toast in the corner does not widen the box
    band = g.crop((int(w * 0.12), 0, int(w * 0.88), h))
    box = band.getbbox()
    if not box:
        print('no box', n); continue
    l, t, r, b = box
    l += int(w * 0.12); r += int(w * 0.12)
    pad = 16
    im.crop((max(0, l - pad), max(0, t - pad), min(w, r + pad), min(h, b + pad))).save(d / f'{n}-crop.webp', 'WEBP', quality=88, method=6)
    print(n, (r - l, b - t))
