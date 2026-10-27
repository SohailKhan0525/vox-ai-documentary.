import React from 'react';
import {registerRoot,Composition} from 'remotion';
import {Documentary} from './video';
const Root:React.FC=()=> <Composition id="Documentary" component={Documentary} durationInFrames={1050} fps={30} width={1080} height={1920}/>;
registerRoot(Root);
