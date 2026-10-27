import os
os.environ['OMP_NUM_THREADS']='2'
import soundfile as sf
from kokoro_onnx import Kokoro
import onnxruntime as ort
options=ort.SessionOptions(); options.intra_op_num_threads=2; options.inter_op_num_threads=1
k=Kokoro('assets/kokoro-v1.0.onnx','assets/voices-v1.0.bin')
for voice in ['af_sarah','am_michael']:
 y,sr=k.create('AI can draft an answer. But who checks the work?',voice=voice,speed=1.0,lang='en-us')
 sf.write('audio/test_'+voice+'.wav',y,sr)
 print(voice,len(y)/sr)
