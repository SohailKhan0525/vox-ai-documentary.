import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia,renderStill} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const mode=process.argv[2]||'final';
const serveUrl=await bundle({entryPoint:path.resolve('src/index.tsx'),onProgress:()=>{}});
const common={serveUrl,browserExecutable:'/usr/bin/chromium',chromiumOptions:{gl:'angle',enableMultiProcessOnLinux:true},logLevel:'warn'};
const composition=await selectComposition({...common,id:'Documentary'});
if(mode==='stills'){
 for(const frame of [0,30,85,130,155,210,290,360,440,510,605,675,770,845,920,990,1049]){
  await renderStill({...common,composition,frame,output:path.resolve(`previews/frame_${String(frame).padStart(4,'0')}.png`),scale:.5});
 }
}else{
 const file=mode==='prototype'?'previews/prototype_5s.mp4':mode==='draft'?'previews/draft_35s.mp4':'output/ai_future_documentary_35s.mp4';
 let last=-1;
 await renderMedia({...common,composition,codec:'h264',audioCodec:'aac',audioBitrate:'192k',sampleRate:48000,pixelFormat:'yuv420p',colorSpace:'bt709',crf:mode==='final'?18:23,x264Preset:'medium',concurrency:2,scale:mode==='draft'?.5:1,frameRange:mode==='prototype'?[0,149]:undefined,outputLocation:path.resolve(file),onProgress:({progress})=>{let p=Math.floor(progress*10);if(p!==last){console.log(`${mode} ${p*10}%`);last=p}}});
 console.log(file,fs.statSync(file).size);
}
