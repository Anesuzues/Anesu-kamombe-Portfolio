# Matte a generated sheet and split it into separate figures by connected components.
import sys, numpy as np, os
from PIL import Image
from rembg import new_session, remove
import cv2
src, outdir, n = sys.argv[1], sys.argv[2], int(sys.argv[3])
os.makedirs(outdir, exist_ok=True)
im = Image.open(src).convert('RGB')
s = new_session('isnet-general-use')
# matte in tiles is unreliable; matte whole image at full res via alpha of a downscaled pass, then refine per figure
small = im.resize((im.width // 2, im.height // 2), Image.LANCZOS)
a = np.asarray(remove(small, session=s, only_mask=True))
m = (cv2.resize(a, im.size) > 100).astype(np.uint8)
m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
for c in sys.argv[4:]:
    x, y0, y1 = map(int, c.split(',')); m[y0:y1, x-3:x+3] = 0
import os as _o
if _o.environ.get('POLY'):
    pts = np.array([list(map(int, p.split(','))) for p in _o.environ['POLY'].split(';')], np.int32)
    cv2.polylines(m, [pts], False, 0, 5)
k, lab, st, cen = cv2.connectedComponentsWithStats(m)
comps = sorted([i for i in range(1, k)], key=lambda i: -st[i, 4])[:n]
H = im.height
rows = sorted(comps, key=lambda i: (round(cen[i][1] / (H / 2.2)), cen[i][0]))
for j, i in enumerate(rows):
    x, y, w, h, area = st[i]; p = 24
    box = (max(0, x - p), max(0, y - p), min(im.width, x + w + p), min(im.height, y + h + p))
    crop = im.crop(box)
    fine = np.asarray(remove(crop, session=s, only_mask=True)).copy()
    keep = cv2.dilate((lab[box[1]:box[3], box[0]:box[2]] == i).astype(np.uint8), np.ones((15, 15), np.uint8))
    fine[keep == 0] = 0
    fine[fine < 24] = 0
    out = crop.copy(); out.putalpha(Image.fromarray(fine))
    out = out.crop(out.getchannel('A').getbbox()); out.save(f'{outdir}/{j}.png'); print(j, out.size, area)
