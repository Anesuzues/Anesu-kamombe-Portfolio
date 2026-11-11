import sys, numpy as np, onnxruntime as ort, time
from PIL import Image
s = ort.InferenceSession('models/esrgan.onnx', providers=['CPUExecutionProvider'])
for f in sys.argv[2:]:
    t = time.time()
    im = np.asarray(Image.open(f'{sys.argv[1]}/{f}.png').convert('RGB'), np.float32) / 255
    p = 8; x = np.pad(im, ((p, p), (p, p), (0, 0)), mode='reflect').transpose(2, 0, 1)[None]
    o = s.run(None, {'in': x})[0][0].transpose(1, 2, 0)[p*4:-p*4, p*4:-p*4]
    Image.fromarray((o.clip(0, 1) * 255 + .5).astype(np.uint8)).save(f'up/{f}.png'); print(f, o.shape, round(time.time() - t, 1), flush=True)
