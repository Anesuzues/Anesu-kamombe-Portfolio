# Convert RealESRGAN_x4plus.pth (RRDBNet) to ONNX without torch: read tensors straight from the checkpoint zip.
import zipfile, pickle, numpy as np, onnx, sys
from onnx import helper as H, TensorProto as T, numpy_helper as NH
zf = zipfile.ZipFile(sys.argv[1]); root = [n for n in zf.namelist() if n.endswith('data.pkl')][0][:-8]
class Storage:
    def __init__(s, dtype, key): s.dtype, s.key = dtype, key
def rebuild(storage, offset, size, stride, *a):
    arr = np.frombuffer(zf.read(f'{root}data/{storage.key}'), dtype=storage.dtype)
    n = int(np.prod(size)) if size else 1
    return arr[offset:offset+n].reshape(size).copy()
class U(pickle.Unpickler):
    def find_class(s, mod, name):
        if name == '_rebuild_tensor_v2': return rebuild
        if name == 'FloatStorage': return np.float32
        if name == 'OrderedDict':
            import collections; return collections.OrderedDict
        raise pickle.UnpicklingError(f'blocked {mod}.{name}')
    def persistent_load(s, pid): return Storage(pid[1], pid[2])
sd = U(zf.open(root + 'data.pkl')).load()
sd = sd.get('params_ema', sd.get('params', sd))
nodes, inits, cnt = [], [], [0]
def nm(p='t'): cnt[0] += 1; return f'{p}{cnt[0]}'
def conv(x, key):
    w, b = sd[key + '.weight'], sd[key + '.bias']
    inits.extend([NH.from_array(w, key + '.w'), NH.from_array(b, key + '.b')])
    o = nm(); nodes.append(H.make_node('Conv', [x, key + '.w', key + '.b'], [o], pads=[1, 1, 1, 1])); return o
def lrelu(x): o = nm(); nodes.append(H.make_node('LeakyRelu', [x], [o], alpha=0.2)); return o
def cat(xs): o = nm(); nodes.append(H.make_node('Concat', xs, [o], axis=1)); return o
inits.append(NH.from_array(np.array(0.2, np.float32), 'c02'))
inits.append(NH.from_array(np.array([1, 1, 2, 2], np.float32), 'up2'))
def res(x, y):
    m = nm(); nodes.append(H.make_node('Mul', [y, 'c02'], [m]))
    o = nm(); nodes.append(H.make_node('Add', [x, m], [o])); return o
def add(x, y): o = nm(); nodes.append(H.make_node('Add', [x, y], [o])); return o
def up(x): o = nm(); nodes.append(H.make_node('Resize', [x, '', 'up2'], [o], mode='nearest')); return o
def rdb(x, k):
    x1 = lrelu(conv(x, k + '.conv1')); x2 = lrelu(conv(cat([x, x1]), k + '.conv2'))
    x3 = lrelu(conv(cat([x, x1, x2]), k + '.conv3')); x4 = lrelu(conv(cat([x, x1, x2, x3]), k + '.conv4'))
    return res(x, conv(cat([x, x1, x2, x3, x4]), k + '.conv5'))
feat = conv('in', 'conv_first'); x = feat
for i in range(23):
    y = x
    for j in (1, 2, 3): y = rdb(y, f'body.{i}.rdb{j}')
    x = res(x, y)
x = add(feat, conv(x, 'conv_body'))
x = lrelu(conv(up(x), 'conv_up1')); x = lrelu(conv(up(x), 'conv_up2'))
x = conv(lrelu(conv(x, 'conv_hr')), 'conv_last')
nodes.append(H.make_node('Identity', [x], ['out']))
g = H.make_graph(nodes, 'rrdb', [H.make_tensor_value_info('in', T.FLOAT, [1, 3, 'h', 'w'])],
                 [H.make_tensor_value_info('out', T.FLOAT, [1, 3, 'H', 'W'])], inits)
onnx.save(H.make_model(g, opset_imports=[H.make_opsetid('', 13)], ir_version=8), sys.argv[2])
