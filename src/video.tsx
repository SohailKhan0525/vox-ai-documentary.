import React from 'react';
import {AbsoluteFill,Audio,Img,interpolate,staticFile,useCurrentFrame,Easing} from 'remotion';
import timing from './timing.json';
const C={paper:'#eeece2',ink:'#142e35',lime:'#d9f56a',coral:'#e5674e',mute:'#738681',white:'#faf8ee'};
const ease=Easing.bezier(.18,.8,.22,1);
const at=(f:number,s:number,d=22)=>interpolate(f,[s,s+d],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease});
const wob=(f:number)=>Math.sin(f/30)*3;
const Tx:React.FC<{x:number;y:number;size?:number;fill?:string;weight?:string;anchor?:'start'|'middle'|'end';children:React.ReactNode;spacing?:number;family?:string}> =({x,y,size=42,fill=C.ink,weight='bold',anchor='start',children,spacing=0,family='Editorial'})=><text x={x} y={y} fill={fill} fontFamily={family} fontSize={size} fontWeight={weight} textAnchor={anchor} letterSpacing={spacing}>{children}</text>;
const Line:React.FC<{x1:number;y1:number;x2:number;y2:number;color?:string;w?:number;p?:number}> =({x1,y1,x2,y2,color=C.ink,w=5,p=1})=><line x1={x1} y1={y1} x2={x1+(x2-x1)*p} y2={y1+(y2-y1)*p} stroke={color} strokeWidth={w} strokeLinecap="round"/>;
const Label:React.FC<{x:number;y:number;children:React.ReactNode;fill?:string}> =({x,y,children,fill=C.ink})=><Tx x={x} y={y} size={25} fill={fill} weight="normal" family="Mono" spacing={2}>{children}</Tx>;
const Lift:React.FC<{f:number;start?:number;children:React.ReactNode;dx?:number;dy?:number}> =({f,start=0,children,dx=0,dy=65})=>{const p=at(f,start);return <g opacity={p} transform={`translate(${dx*(1-p)} ${dy*(1-p)})`}>{children}</g>};
const Check:React.FC<{x:number;y:number;s?:number;color?:string;p?:number}> =({x,y,s=1,color=C.ink,p=1})=><path d={`M${x} ${y} l${24*s} ${25*s} l${52*s} ${-65*s}`} fill="none" stroke={color} strokeWidth={10*s} strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p}/>;
function Lines({x,y,w=500,f,start=0,color=C.mute,count=4}:{x:number;y:number;w?:number;f:number;start?:number;color?:string;count?:number}) {return <g>{Array.from({length:count},(_,i)=><Line key={i} x1={x} y1={y+i*38} x2={x+w*(i===count-1?.62:1)} y2={y+i*38} color={color} w={9} p={at(f,start+i*4,20)}/>)}</g>}
function Paper({x,y,w,h,rotate=0,children}:{x:number;y:number;w:number;h:number;rotate?:number;children?:React.ReactNode}){return <g transform={`translate(${x} ${y}) rotate(${rotate} ${w/2} ${h/2})`}><rect x={15} y={22} width={w} height={h} fill={C.ink} opacity=".16"/><rect width={w} height={h} fill={C.white} stroke={C.ink} strokeWidth="2"/>{children}</g>}
function Icon({kind,x,y,s=1,color=C.ink}:{kind:string;x:number;y:number;s?:number;color?:string}){return <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">{kind==='read'?<><path d="M0 0 Q25 -12 50 0 Q75 -12 100 0 V75 Q75 63 50 75 Q25 63 0 75 Z"/><path d="M50 0 V75 M12 20 H35 M65 20 H88 M12 37 H35 M65 37 H88"/></>:kind==='write'?<><path d="M0 12 H65 V90 H0 Z M23 58 L75 6 L91 22 L39 74 L17 80 Z"/><path d="M65 16 L81 32"/></>:<><path d="M5 45 L32 72 L93 8"/><circle cx="50" cy="45" r="55" strokeDasharray="5 10"/></>}</g>}
function Hook({f}:{f:number}) {let p=at(f+15,5,28); const intro=f+28;return <>
 <Lift f={intro}><Label x={90} y={290}>THE FUTURE OF ARTIFICIAL INTELLIGENCE</Label></Lift>
 <Lift f={intro} start={3}><Tx x={82} y={465} size={176}>WHO</Tx></Lift>
 <Lift f={intro} start={10}><Tx x={82} y={640} size={166}>CHECKS?</Tx><rect x={88} y={675} width={850*at(f,14,24)} height="13" fill={C.coral}/></Lift>
 <g transform={`translate(0 ${40*(1-p)})`} opacity={p}>
 <image href={staticFile('stipple.png')} x="95" y="640" width="900" height="850" opacity=".7"/>
 <Paper x={155} y={820} w={695} h={420} rotate={-7+wob(f)*.18}><Label x={45} y={63}>GENERATED ANSWER</Label><circle cx="622" cy="55" r="12" fill={C.coral}/><Lines x={48} y={125} w={580} f={f} start={18}/><rect x="40" y="285" width={560*at(f,35,20)} height="55" fill={C.lime}/><Tx x={55} y={324} size={31}>Sounds convincing.</Tx></Paper>
 <g transform={`translate(${700+25*(1-at(f,52))} ${1100-40*(1-at(f,52))}) rotate(12)`} opacity={at(f,52)}><circle r="132" fill={C.ink}/><circle r="111" fill={C.lime} stroke={C.white} strokeWidth="5"/><Tx x={0} y={63} size={180} anchor="middle">?</Tx><path d="M90 100 L175 205" stroke={C.ink} strokeWidth="43" strokeLinecap="round"/></g>
 </g>
 <Lift f={f} start={70}><Label x={100} y={1400}>FAST ANSWER ≠ VERIFIED ANSWER</Label></Lift>
 </>}
function Bundle({f}:{f:number}) {return <>
 <Lift f={f}><Label x={90} y={290}>START WITH THE WORK</Label><Tx x={86} y={438} size={118}>A JOB IS</Tx><Tx x={86} y={575} size={120}>A BUNDLE.</Tx></Lift>
 <g transform={`translate(0 ${-15*at(f,40,70)})`}>
 {[{word:'READ',kind:'read',x:145,y:760,r:-8},{word:'WRITE',kind:'write',x:460,y:820,r:7},{word:'DECIDE',kind:'decide',x:260,y:1080,r:-3}].map((a,i)=><Lift f={f} start={12+i*12} key={a.word} dy={140}><Paper x={a.x} y={a.y} w={365} h={280} rotate={a.r}><rect width="365" height="13" fill={i===2?C.coral:C.lime}/><Icon kind={a.kind} x={45} y={54} s={.9}/><Tx x={40} y={230} size={46}>{a.word}</Tx><Label x={290} y={60}>0{i+1}</Label></Paper></Lift>)}
 <g opacity={at(f,65)}><path d="M140 735 Q60 1040 150 1355 M820 760 Q975 1080 820 1375" stroke={C.ink} strokeWidth="4" fill="none"/><Label x={90} y={1440}>ILLUSTRATIVE TASKS · NOT A JOB FORECAST</Label></g>
 </g></>}
function Tasks({f}:{f:number}){return <>
 <Lift f={f}><Label x={90} y={290}>TASKS, NOT WHOLE JOBS</Label><Tx x={87} y={433} size={110}>AI CAN HELP</Tx><Tx x={87} y={558} size={110}>WITH PARTS.</Tx></Lift>
 {[['READ','Find the key points'],['WRITE','Make a first draft'],['DECIDE','Review the result']].map((a,i)=>{let p=at(f,8+i*22);return <g key={a[0]} transform={`translate(${95+70*(1-p)} ${720+i*226})`} opacity={p}><rect x="12" y="14" width="880" height="186" fill={C.ink} opacity=".1"/><rect width="880" height="186" fill={i===2?C.ink:C.white} stroke={C.ink} strokeWidth="3"/><circle cx="78" cy="85" r="43" fill={i===2?C.coral:C.lime}/><Tx x={78} y={100} size={40} anchor="middle">{i+1}</Tx><Tx x={153} y={82} size={54} fill={i===2?C.white:C.ink}>{a[0]}</Tx><Tx x={155} y={134} size={31} fill={i===2?C.paper:C.mute} weight="normal">{a[1]}</Tx>{i<2?<g opacity={at(f,70+i*8)}><Label x={694} y={70}>AI</Label><path d="M720 96 l18 18 l35 -43" stroke={C.ink} strokeWidth="7" fill="none"/></g>:<g opacity={at(f,95)}><Label x={665} y={70} fill={C.lime}>HUMAN</Label><circle cx="733" cy="117" r="16" stroke={C.lime} fill="none" strokeWidth="4"/></g>}</g>})}
 </>}
function Wrong({f}:{f:number}) {return <>
 <Lift f={f}><Label x={90} y={290} fill={C.paper}>THE CATCH</Label><Tx x={87} y={437} size={111} fill={C.paper}>FLUENT</Tx><Tx x={87} y={563} size={111} fill={C.paper}>ISN'T FACT.</Tx></Lift>
 <g transform={`translate(${8*Math.sin(f/55)} ${-12*at(f,0,130)})`}>
 <Lift f={f} start={7}><Paper x={120} y={735} w={840} h={500} rotate={-3}><Label x={45} y={65}>AI OUTPUT / ILLUSTRATION</Label><Lines x={46} y={130} w={720} f={f} start={12} count={6}/><rect x="35" y="222" width={760*at(f,30)} height="55" fill={C.coral} opacity=".55"/><path d="M45 266 Q160 247 275 266 T500 266 T755 266" stroke={C.coral} strokeWidth="6" fill="none"/></Paper></Lift>
 <g transform={`translate(345 1110) rotate(${-9+14*(1-at(f,72,8))}) scale(${1+.15*(1-at(f,72,8))})`} opacity={at(f,71,6)}><rect x="0" y="0" width="590" height="143" fill={C.coral} stroke={C.ink} strokeWidth="5"/><Tx x={295} y={99} size={79} anchor="middle">VERIFY IT.</Tx></g>
 </g>
 <Lift f={f} start={95}><Label x={90} y={1410} fill={C.paper}>CONFIDENT LANGUAGE CAN HIDE ERRORS.</Label><Label x={90} y={1460} fill={C.mute}>SOURCE: OPENAI MODEL CARD / SIMPLEQA</Label></Lift>
 </>}
function Network({f}:{f:number}){const nodes=[{x:200,y:895},{x:540,y:780},{x:880,y:895},{x:200,y:1200},{x:540,y:1080},{x:880,y:1200}];return <>
 <Lift f={f}><Label x={90} y={290}>SPEED CHANGES THE STAKES</Label><Tx x={87} y={431} size={106}>ERRORS CAN</Tx><Tx x={87} y={555} size={124}>TRAVEL.</Tx></Lift>
 {[[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5],[0,4],[2,4]].map(([a,b],i)=><Line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} color={C.mute} w={3} p={at(f,12+i*3,30)}/>)}
 {nodes.map((n,i)=>{let p=at(f,8+i*8);let error=i<5&&f>42+i*8;return <g key={i} transform={`translate(${n.x} ${n.y}) scale(${p})`}><rect x="-77" y="-90" width="154" height="180" fill={error?C.coral:C.white} stroke={C.ink} strokeWidth="3"/><Line x1={-45} y1={-43} x2={43} y2={-43} w={5}/><Line x1={-45} y1={-20} x2={25} y2={-20} w={5}/><Tx x={0} y={49} size={54} anchor="middle">{error?'!':i===5?'?':'·'}</Tx></g>})}
 <g transform={`translate(540 1370) scale(${at(f,96)})`}><rect x="-350" y="-47" width="700" height="94" fill={C.ink}/><Tx x={0} y={18} size={40} anchor="middle" fill={C.lime}>CHECK BEFORE SHARING</Tx></g>
 <Label x={90} y={1470}>CONCEPTUAL DIAGRAM · NO MEASURED RATE</Label>
 </>}
function Choice({f}:{f:number}){return <>
 <Lift f={f}><Label x={90} y={290}>THE HUMAN DECISION</Label><Tx x={87} y={430} size={103}>WHAT SHOULD</Tx><Tx x={87} y={552} size={100}>WE HAND OFF?</Tx></Lift>
 <g transform={`translate(0 ${10*Math.sin(f/65)})`}>
 <Lift f={f} start={10}><Paper x={107} y={755} w={410} h={540} rotate={-5}><rect width="410" height="20" fill={C.lime}/><Label x={34} y={77}>AUTOMATE</Label><Icon x={143} y={134} kind="write" s={1.3}/><Tx x={35} y={360} size={48}>First drafts</Tx><Tx x={35} y={417} size={34} weight="normal">Repeatable steps</Tx><Lines x={35} y={460} w={340} f={f} start={20} count={1}/></Paper></Lift>
 <Lift f={f} start={24}><Paper x={556} y={775} w={410} h={540} rotate={5}><rect width="410" height="20" fill={C.coral}/><Label x={34} y={77}>KEEP HUMAN</Label><Icon x={150} y={143} kind="decide" s={1.1}/><Tx x={35} y={360} size={46}>Judgment</Tx><Tx x={35} y={417} size={34} weight="normal">Accountability</Tx><Lines x={35} y={460} w={340} f={f} start={34} count={1}/></Paper></Lift>
 <g opacity={at(f,68)}><path d="M385 1390 Q540 1460 695 1390" stroke={C.ink} strokeWidth="5" fill="none"/><circle cx="540" cy="1424" r="28" fill={C.lime} stroke={C.ink} strokeWidth="4"/></g>
 </g></>}
function Human({f}:{f:number}){return <>
 <Lift f={f}><Label x={90} y={290} fill={C.paper}>THE FUTURE IS A CHOICE.</Label><Tx x={87} y={452} size={121} fill={C.paper}>KEEP THE</Tx><Tx x={87} y={597} size={151} fill={C.lime}>HUMAN.</Tx></Lift>
 <g transform={`translate(540 1030) scale(${.9+.1*at(f,0,100)})`}>
 {Array.from({length:9},(_,i)=>{const r=130+i*22;return <path key={i} d={`M${-r*.84} ${r*.52} C${-r*1.4} ${-r*.9} ${r*1.4} ${-r*.9} ${r*.84} ${r*.52}`} fill="none" stroke={i%3===0?C.lime:C.mute} strokeWidth="7" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-at(f,10+i*4,50)}/>})}
 <circle r="108" fill={C.lime} transform={`scale(${at(f,15)})`}/><Check x={-42} y={10} s={1.25} p={at(f,35,25)}/>
 <path d="M-380 210 Q0 385 380 210" stroke={C.coral} strokeWidth="7" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={1-at(f,35,50)}/>
 </g>
 <Lift f={f} start={65}><Tx x={540} y={1410} size={39} anchor="middle" fill={C.paper} weight="normal">Better tools. Deliberate choices.</Tx></Lift>
 </>}
const scenes=[Hook,Bundle,Tasks,Wrong,Network,Choice,Human];
const darks=[false,false,false,true,false,false,true];
function Caption({f,idx}:{f:number;idx:number}){const t=timing[idx];if(f<t.speechStart*30||f>t.speechEnd*30+9)return null;let words=t.text.split(' ');let chunks:string[]=[];let line='';for(const w of words){if((line+' '+w).trim().length>35){chunks.push(line);line=w}else line=(line+' '+w).trim()}if(line)chunks.push(line);return <g>{chunks.map((s,i)=><Tx key={i} x={540} y={1585+i*57} size={39} fill={darks[idx]?C.white:C.ink} weight="normal" anchor="middle">{s}</Tx>)}</g>}
export const Documentary:React.FC=()=>{const f=useCurrentFrame();let idx=timing.findIndex(t=>f>=t.startFrame&&f<t.endFrameExclusive);if(idx<0)idx=6;const local=f-timing[idx].startFrame+(idx===0?0:12);const Scene=scenes[idx];const dark=darks[idx];const remaining=timing[idx].endFrameExclusive-f;const wipe=remaining<12&&idx<6?at(12-remaining,0,12):0; const Next=scenes[Math.min(idx+1,6)];
return <AbsoluteFill style={{backgroundColor:dark?C.ink:C.paper}}><style>{`@font-face{font-family:Editorial;src:url('${staticFile('fonts/Editorial-Regular.ttf')}')}@font-face{font-family:Editorial;src:url('${staticFile('fonts/Editorial-Bold.ttf')}');font-weight:700}@font-face{font-family:Mono;src:url('${staticFile('fonts/Editorial-Mono.ttf')}')}`}</style>
 {!dark&&<Img src={staticFile('paper.png')} style={{position:'absolute',inset:0,width:1080,height:1920}}/>}
 <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute'}}>
 <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0 H0 V60" fill="none" stroke={dark?C.paper:C.ink} strokeWidth="1" opacity=".035"/></pattern></defs><rect width="1080" height="1920" fill="url(#grid)"/>
 <Label x={90} y={169} fill={dark?C.paper:C.ink}>FIELDNOTES</Label><Label x={990} y={169} fill={dark?C.mute:C.mute}><tspan textAnchor="end">AI / WORK</tspan></Label><Line x1={90} y1={202} x2={990} y2={202} color={dark?C.mute:C.ink} w={2}/>
 <g transform={`translate(540 900) scale(${1+local*.00008}) translate(-540 -900)`}><Scene f={local}/></g>
 <Caption f={f} idx={idx}/>
 <Line x1={90} y1={1760} x2={990} y2={1760} color={dark?C.mute:C.mute} w={2}/><Line x1={90} y1={1760} x2={90+900*f/1049} y2={1760} color={dark?C.lime:C.ink} w={5}/>
 <Label x={90} y={1810} fill={dark?C.mute:C.mute}>{String(idx+1).padStart(2,'0')} / 07</Label><Tx x={990} y={1810} anchor="end" size={23} fill={dark?C.mute:C.mute} family="Mono" weight="normal">AN ORIGINAL AI EXPLAINER</Tx>
 {wipe>0&&<g transform={`translate(${1080*(1-wipe)} 0)`}><clipPath id="pageclip"><rect x="0" y="222" width="1080" height="1280"/></clipPath><g clipPath="url(#pageclip)"><rect y="222" width="1080" height="1280" fill={darks[idx+1]?C.ink:C.paper}/><Next f={12-remaining}/></g><rect x="0" y="222" width="13" height="1280" fill={C.coral}/></g>}
 </svg><Audio src={staticFile('audio/master.wav')}/></AbsoluteFill>}
