"""Real media checks. Fails the process on format/decode/blank-frame defects."""
import json,subprocess,re,hashlib
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parents[1]
import os;os.chdir(ROOT)
P=Path('output/ai_future_documentary_35s.mp4');assert P.exists() and P.stat().st_size>100000

def run(args):return subprocess.run(args,check=True,capture_output=True,text=True)
probe=json.loads(run(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(P)]).stdout)
v=next(s for s in probe['streams'] if s['codec_type']=='video');a=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert (v['width'],v['height'])==(1080,1920)
assert v['r_frame_rate']=='30/1' and int(v['nb_read_frames'])==1050
assert v['codec_name']=='h264' and v['pix_fmt']=='yuv420p'
assert abs(float(v['duration'])-35)<.001
assert abs(float(probe['format']['duration'])-35)<.05
assert a['codec_name']=='aac' and int(a['sample_rate'])==48000
# Decode every video/audio packet. A successful header probe alone is insufficient.
decode=run(['ffmpeg','-v','error','-xerror','-i',str(P),'-f','null','-']);assert not decode.stderr.strip(),decode.stderr
black=run(['ffmpeg','-hide_banner','-i',str(P),'-vf','blackdetect=d=0.033:pix_th=0.10:pic_th=0.98','-an','-f','null','-'])
blacklines=[s for s in black.stderr.splitlines() if 'black_start:' in s];assert not blacklines,blacklines
# Inspect every frame at small resolution for unexpected solid/blank frames.
raw=subprocess.run(['ffmpeg','-v','error','-i',str(P),'-vf','scale=54:96','-pix_fmt','rgb24','-f','rawvideo','-'],check=True,capture_output=True).stdout
frames=np.frombuffer(raw,dtype=np.uint8).reshape(-1,96,54,3)
std=frames.astype(float).std(axis=(1,2)).mean(axis=1);assert len(frames)==1050
blank=np.flatnonzero(std<4).tolist();assert not blank,blank
# Representative stills include every scene, opening, ending, and transition boundaries.
selected=[0,30,85,134,135,210,269,270,360,419,420,510,584,585,675,749,750,845,899,900,990,1049]
Path('previews/final_frames').mkdir(exist_ok=True)
for n in selected:
 run(['ffmpeg','-y','-v','error','-i',str(P),'-vf',f'select=eq(n\\,{n}),scale=540:960','-fps_mode','vfr','-frames:v','1',f'previews/final_frames/frame_{n:04d}.png'])
hero=[0,85,210,360,510,675,845,990,1049]
sheet=Image.new('RGB',(1080,2040),'#c9c7bd');d=ImageDraw.Draw(sheet);font=ImageFont.truetype('public/fonts/Editorial-Mono.ttf',18)
for i,n in enumerate(hero):
 im=Image.open(f'previews/final_frames/frame_{n:04d}.png').convert('RGB').resize((360,640),Image.Resampling.LANCZOS);x=i%3*360;y=i//3*680;sheet.paste(im,(x,y));d.text((x+12,y+648),f'{n:04d}f / {n/30:.2f}s',font=font,fill='#142e35')
sheet.save('previews/contact_sheet.png')
# Updated prototype sheet, actual encoded frames, no simulated previews.
run(['ffmpeg','-y','-v','error','-i','previews/prototype_5s.mp4','-vf','fps=2,scale=270:480,tile=5x2','-frames:v','1','previews/prototype_contact_sheet.png'])
loud=run(['ffmpeg','-hide_banner','-i',str(P),'-af','ebur128=peak=true','-f','null','-']).stderr
Path('docs/final_audio_loudness.txt').write_text(loud[loud.rfind('Summary:'):])
peak=float(re.search(r'Peak:\s+(-?[\d.]+) dBFS',loud[loud.rfind('Summary:'):]).group(1));assert peak<0
# Verify muxed soundtrack alignment against the mastered source, accounting for AAC.
import soundfile as sf
from scipy.signal import resample_poly, correlate, correlation_lags
master,sr=sf.read('public/audio/master.wav');expected=resample_poly(master.mean(axis=1),1,10)
b=subprocess.run(['ffmpeg','-v','error','-i',str(P),'-vn','-ac','1','-ar','4800','-f','f32le','-'],check=True,capture_output=True).stdout
actual=np.frombuffer(b,dtype='<f4');c=correlate(actual,expected,method='fft');lags=correlation_lags(len(actual),len(expected));limit=np.abs(lags)<=480
lag=int(lags[limit][np.argmax(c[limit])]);assert abs(lag/4800)<1/30
count=min(len(actual),len(expected));audio_corr=float(np.corrcoef(actual[:count],expected[:count])[0,1]);assert audio_corr>.98
result=dict(audioOffsetSeconds=lag/4800,audioMasterCorrelation=audio_corr,file=str(P),bytes=P.stat().st_size,sha256=hashlib.sha256(P.read_bytes()).hexdigest(),videoFrames=1050,fps=30,videoDuration=float(v['duration']),containerDuration=float(probe['format']['duration']),width=v['width'],height=v['height'],pixelFormat=v['pix_fmt'],videoCodec=v['codec_name'],audioCodec=a['codec_name'],audioSampleRate=int(a['sample_rate']),decodedAllPackets=True,blackIntervals=blacklines,solidBlankFrames=blank,minFrameStd=float(std.min()),audioTruePeakDbfs=peak,visualReview='Contact sheet and representative frames inspected separately; not a claim of watching all frames',auditoryReview='Audio playback cannot be auditioned through the available model input; intelligibility and subjective voice/music quality require human listening')
Path('docs/qc_results.json').write_text(json.dumps(result,indent=2));Path('docs/ffprobe_final.json').write_text(json.dumps(probe,indent=2));print(json.dumps(result,indent=2))
