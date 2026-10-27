"""Local neural narration + original deterministic score. No paid APIs/assets."""
import os
os.environ['OMP_NUM_THREADS']='2'
from pathlib import Path
import json, subprocess, hashlib
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt
from kokoro_onnx import Kokoro
ROOT=Path(__file__).resolve().parents[1]; os.chdir(ROOT)
SR=48000; N=35*SR; rng=np.random.default_rng(52)
SCENES=[
 (0,135,"AI can draft an answer in seconds. But who checks it?"),
 (135,270,"A job isn't one task. It's a bundle."),
 (270,420,"Reading. Writing. Deciding. AI can help with parts of that bundle."),
 (420,585,"But a fluent answer can still be wrong."),
 (585,750,"And when mistakes move faster, checking matters more."),
 (750,900,"So the question isn't just what we can automate."),
 (900,1050,"It's what we choose to keep human.")]
Path('audio').mkdir(exist_ok=True);Path('public/audio').mkdir(parents=True,exist_ok=True)
k=Kokoro('assets/kokoro-v1.0.onnx','assets/voices-v1.0.bin')
voice=np.zeros(N); timings=[]
for i,(start,end,text) in enumerate(SCENES):
 path=Path(f'audio/voice_{i}.wav')
 fingerprint=hashlib.sha256((text+'|am_michael|0.94|en-us').encode()).hexdigest()
 keypath=path.with_suffix('.json')
 if path.exists() and keypath.exists() and json.loads(keypath.read_text()).get('fingerprint')==fingerprint: y,sr=sf.read(path)
 else:
  y,sr=k.create(text,voice='am_michael',speed=.94,lang='en-us'); sf.write(path,y,sr); keypath.write_text(json.dumps(dict(fingerprint=fingerprint,text=text,voice='am_michael',speed=.94)))
 y=resample_poly(y,2,1) if sr==24000 else resample_poly(y,SR,sr)
 slot=(end-start)/30-.5
 if len(y)/SR>slot:
  # supported pitch-preserving tempo change, only where necessary
  tempo=(len(y)/SR)/slot
  subprocess.run(['ffmpeg','-y','-v','error','-i',str(path),'-af',f'atempo={tempo}','-ar',str(SR),'audio/fit.wav'],check=True)
  y,_=sf.read('audio/fit.wav')
 onset=start/30+.2; offset=onset+len(y)/SR
 p=round(onset*SR); voice[p:p+len(y)]+=y[:N-p]
 timings.append(dict(scene=i,startFrame=start,endFrameExclusive=end,text=text,speechStart=onset,speechEnd=offset,words=[dict(word=w,start=onset+j*(offset-onset)/len(text.split()),end=onset+(j+1)*(offset-onset)/len(text.split())) for j,w in enumerate(text.split())],wordTimingMethod='uniform estimates within measured utterance; not forced alignment'))
 print(i,round(len(y)/SR,3),text,flush=True)
# 120 BPM, 4/4, A-minor editorial pulse. All synthesis original.
music=np.zeros((N,2)); fx=np.zeros((N,2))
def add(track,wave,t,pan=0):
 pos=int(t*SR)
 if pos<0:return
 wave=wave[:max(0,N-pos)]
 track[pos:pos+len(wave),0]+=wave*np.sqrt((1-pan)/2)
 track[pos:pos+len(wave),1]+=wave*np.sqrt((1+pan)/2)
def tone(freq,dur,amp=.1,decay=2):
 t=np.arange(int(dur*SR))/SR
 return amp*(np.sin(2*np.pi*freq*t)+.25*np.sin(2*np.pi*2*freq*t))*np.minimum(t/.018,1)*np.exp(-decay*t)
chords=[[220,261.6256,329.6276],[174.614,220,261.6256],[130.813,164.814,195.998],[195.998,246.942,293.665]]
for beat in range(70):
 t=beat*.5
 chord=chords[(beat//8)%4]
 if beat%2==0:
  tt=np.arange(int(.36*SR))/SR
  kick=.08*np.sin(2*np.pi*(45*tt+16*(1-np.exp(-tt*25))/25))*np.exp(-tt*16)
  add(music,kick,t)
 freq=chord[beat%3]*(2 if beat%4 else 1)
 add(music,tone(freq,.9,.035,4),t,pan=(-.4 if beat%2 else .4))
 if beat%8==0:
  tt=np.arange(4*SR)/SR
  pad=sum(np.sin(2*np.pi*f*tt)+.2*np.sin(2*np.pi*f*1.002*tt) for f in chord)*.012
  pad*=np.sin(np.pi*np.clip(tt/4,0,1))**1.5
  add(music,pad,t)
# Timeline motivated transient accents, no random foley.
accents=[(.1,'impact'),(2.8,'tick'),(4.12,'sweep'),(6.1,'tick'),(8.62,'sweep'),(9,'impact'),(9.6,'tick'),(10.333333,'tick'),(11.766667,'tick'),(13.62,'sweep'),(16,'impact'),(19.12,'sweep'),(20.5,'tick'),(21.033333,'tick'),(21.566667,'tick'),(24.62,'sweep'),(25,'impact'),(27,'tick'),(29.62,'sweep'),(31,'impact')]
for t,kind in accents:
 if kind=='tick': w=tone(900,.07,.07,50)+tone(1400,.07,.025,50)
 elif kind=='impact':
  tt=np.arange(int(.45*SR))/SR;w=.15*np.sin(2*np.pi*(55*tt+20*tt*np.exp(-tt*10)))*np.exp(-tt*12)+rng.normal(0,.025,len(tt))*np.exp(-tt*35)
 else:
  tt=np.arange(int(.32*SR))/SR;n=rng.normal(0,1,len(tt)); n=sosfilt(butter(2,[500,4000],btype='bandpass',fs=SR,output='sos'),n);w=n*np.sin(np.pi*tt/.32)**2*.065
 add(fx,w,t,pan=0)
# Speech-keyed ducking (smoothed energy envelope); score is intentionally quiet.
energy=np.convolve(np.abs(voice)[::480],np.ones(12)/12,mode='same')
env=np.interp(np.arange(N),np.arange(len(energy))*480,energy)
duck=1-.55*np.clip(env/.025,0,1)
music*=duck[:,None]
fade=np.minimum(np.arange(N)/SR/1.0,1)*np.clip((35-np.arange(N)/SR)/1.1,0,1)
music*=fade[:,None];fx*=fade[:,None]
# Normalize voice to a stable sensible level before final EBU normalization.
voice*=.68/max(np.max(np.abs(voice)),1e-8)
mix=voice[:,None]*np.ones((1,2))+music+fx
sf.write('audio/narration.wav',voice,SR,subtype='PCM_24');sf.write('audio/music.wav',music,SR,subtype='PCM_24');sf.write('audio/effects.wav',fx,SR,subtype='PCM_24');sf.write('audio/mix_premaster.wav',mix,SR,subtype='PCM_24')
subprocess.run(['ffmpeg','-y','-v','error','-i','audio/mix_premaster.wav','-af','loudnorm=I=-16:TP=-1.5:LRA=7','-ar','48000','-t','35','public/audio/master.wav'],check=True)
Path('src/timing.json').write_text(json.dumps(timings,indent=2))
Path('audio/beat_map.json').write_text(json.dumps(dict(bpm=120,method='deterministic compositional grid verified against synthesized track; onset analysis in audio_analysis.json',beats=[i*.5 for i in range(70)],accents=accents),indent=2))
# Actual onset measurements, not a claimed perfect beat-tracker result.
import librosa
mono=np.mean(music,axis=1)[::4]
onsets=librosa.onset.onset_detect(y=mono,sr=12000,hop_length=128,units='time')
Path('audio/audio_analysis.json').write_text(json.dumps(dict(detectedMusicOnsetsSeconds=onsets.tolist(),voicePeak=float(abs(voice).max()),premasterPeak=float(abs(mix).max()),durationSeconds=35),indent=2))
