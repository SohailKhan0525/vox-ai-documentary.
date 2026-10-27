from pathlib import Path
import numpy as np
from PIL import Image
import skia
rng=np.random.default_rng(17)
# Original subtle print texture; static across frames, avoiding temporal noise.
n=rng.normal(0,1.8,(1920,1080,1));c=np.array([238,236,226])[None,None,:]
Image.fromarray(np.uint8(np.clip(c+n,0,255))).save('public/paper.png')
# Original Skia stipple field, used as an editorial depth layer.
s=skia.Surface(900,900);cv=s.getCanvas();cv.clear(skia.ColorTRANSPARENT)
p=skia.Paint(Color=skia.ColorSetARGB(42,31,47,51),AntiAlias=True)
for row in range(46):
 for col in range(46):
  x=col*20;y=row*20;r=1.0+3.5*(1-abs(x-450)/450)*(1-abs(y-450)/450)
  cv.drawCircle(x,y,r,p)
s.makeImageSnapshot().save('public/stipple.png',skia.kPNG)
