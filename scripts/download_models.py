from pathlib import Path
import hashlib, urllib.request
ROOT=Path(__file__).resolve().parents[1]
assets=ROOT/'assets';assets.mkdir(exist_ok=True)
checks={}
for line in (assets/'SHA256SUMS').read_text().splitlines():
 digest,name=line.split(maxsplit=1);checks[Path(name.strip()).name]=digest
for name in ['kokoro-v1.0.onnx','voices-v1.0.bin']:
 p=assets/name
 if not p.exists():
  tmp=p.with_suffix(p.suffix+'.download')
  urllib.request.urlretrieve('https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/'+name,tmp)
  if hashlib.sha256(tmp.read_bytes()).hexdigest()!=checks[name]:
   tmp.unlink();raise RuntimeError('Model hash mismatch: '+name)
  tmp.rename(p)
 if hashlib.sha256(p.read_bytes()).hexdigest()!=checks[name]:raise RuntimeError('Existing model hash mismatch: '+name)
 print('Verified',name)
