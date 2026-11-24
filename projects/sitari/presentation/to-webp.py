"""Converts assets/*.png to assets/*.webp (quality 86) so the deck and repo stay small."""
import pathlib
from PIL import Image
d = pathlib.Path(__file__).parent / 'assets'
for p in sorted(d.glob('*.png')):
    Image.open(p).convert('RGB').save(p.with_suffix('.webp'), 'WEBP', quality=86, method=6)
    p.unlink()
print('converted')
