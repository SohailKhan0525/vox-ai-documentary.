"""Package only project artifacts, never installed dependencies or credentials."""
from pathlib import Path
import subprocess, zipfile, hashlib
ROOT=Path(__file__).resolve().parents[1]
import os;os.chdir(ROOT)
files=[Path(p) for p in subprocess.check_output(['git','ls-files','-z']).decode().split('\0') if p]
files += [Path('output/ai_future_documentary_35s.mp4'),Path('previews/prototype_5s.mp4'),Path('previews/draft_35s.mp4'),Path('public/audio/master.wav')]
files += list(Path('previews/final_frames').glob('*.png'))
files += [Path('audio')/n for n in ['narration.wav','music.wav','effects.wav','mix_premaster.wav']]
files += [Path(f'audio/voice_{i}.wav') for i in range(7)]
archive=Path('output/ai_future_project_bundle.zip')
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(set(files)):
  assert p.is_file(),str(p)
  assert p.resolve().is_relative_to(ROOT)
  z.write(p,'ai_future_documentary/'+str(p))
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 required=['output/ai_future_documentary_35s.mp4','previews/prototype_5s.mp4','previews/contact_sheet.png','docs/quality_report.md','docs/VOX_STYLE_RESEARCH.md','src/video.tsx','public/audio/master.wav','README.md']
 for p in required:assert 'ai_future_documentary/'+p in z.namelist()
 assert hashlib.sha256(z.read('ai_future_documentary/output/ai_future_documentary_35s.mp4')).digest()==hashlib.sha256(Path('output/ai_future_documentary_35s.mp4').read_bytes()).digest()
 print('Verified project archive:',len(z.namelist()),'files,',archive.stat().st_size,'bytes')
Path('output/SHA256SUMS').write_text('\n'.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.name for p in [Path('output/ai_future_documentary_35s.mp4'),archive])+'\n')
