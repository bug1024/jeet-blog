import * as THREE from 'three';
const { create75 } = await import('./character.js?v=' + encodeURIComponent(new URL(import.meta.url).searchParams.get('v') || 'local'));

const { createEnvironment, groundHeight, riverX } = await import('./environment.js?v=' + encodeURIComponent(new URL(import.meta.url).searchParams.get('v') || 'local'));

import { OrbitControls } from 'three/addons/OrbitControls.js';
const $=s=>document.querySelector(s), canvas=$('#world');
let renderer;
try {renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,preserveDrawingBuffer:true});}catch(e){$('#loading').remove();$('#error').hidden=false;throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<760?1.5:2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.04;
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();$('#error').hidden=false;});canvas.addEventListener('webglcontextrestored',()=>location.reload());
const scene=new THREE.Scene();scene.background=new THREE.Color('#dce7df');scene.fog=new THREE.Fog('#dce7df',24,65);
const camera=new THREE.PerspectiveCamera(36,innerWidth/innerHeight,.1,100);const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.06;controls.enablePan=false;controls.minDistance=10;controls.maxDistance=55;controls.minPolarAngle=.28;controls.maxPolarAngle=Math.PI*.465;controls.target.set(0,.85,0);
function resetCamera(){camera.position.set(10.2,10.2,16.3);camera.position.multiplyScalar(Math.max(1,Math.sqrt(1.45/camera.aspect))*(innerWidth<760?1.15:1));controls.target.set(0,innerWidth<760?-.55:.8,0);controls.update();}resetCamera();
const hemi=new THREE.HemisphereLight('#d7e8eb','#555039',1.30);scene.add(hemi);const sun=new THREE.DirectionalLight('#ffe2b1',3.05);sun.position.set(-7,11,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-10,right:10,top:10,bottom:-10,near:.5,far:40});sun.shadow.normalBias=.018;sun.shadow.bias=-.0002;sun.shadow.radius=4;scene.add(sun);const fill=new THREE.DirectionalLight('#e2edf0',.60);fill.position.set(4,6,9);scene.add(fill);
const mats={};function mat(color,roughness=.82){return mats[color]??=new THREE.MeshStandardMaterial({color,roughness,flatShading:true});}
function mesh(g,m,p,parent=scene){const o=new THREE.Mesh(g,typeof m==='string'?mat(m):m);if(p)o.position.set(...p);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function ellipsoid(p,s,c,parent=scene,segments=12){const o=mesh(new THREE.SphereGeometry(1,segments,8),c,p,parent);o.scale.set(...s);return o;}
function box(p,s,c,parent=scene){return mesh(new THREE.BoxGeometry(...s),c,p,parent);}
function rod(a,b,r,c,parent=scene,r2=r,segments=8){const v1=new THREE.Vector3(...a),v2=new THREE.Vector3(...b);const o=mesh(new THREE.CylinderGeometry(r2,r,v1.distanceTo(v2),segments),c,null,parent);o.position.copy(v1).add(v2).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v2.sub(v1).normalize());return o;}
let seed=75;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};const between=(a,b)=>a+(b-a)*rand();
const environment=createEnvironment(scene,renderer);
const water=environment.water;
// 75's model is kept separate from the creek and fish behavior.
const {girl,head,rightArm,netGroup,netCenter,updateCharacter}=create75(scene);
// Open bucket with an actual interior and arching handle.
const bucket=new THREE.Group();bucket.position.set(-2.68,groundHeight(-2.68,1.1)+.02,1.1);scene.add(bucket);mesh(new THREE.CylinderGeometry(.28,.22,.45,18,1,true),new THREE.MeshStandardMaterial({color:'#72cbd4',side:THREE.DoubleSide,roughness:.42}),[0,.23,0],bucket);mesh(new THREE.CylinderGeometry(.22,.22,.035,18),'#53a3b4',[0,.02,0],bucket);const lip=mesh(new THREE.TorusGeometry(.28,.023,8,24),'#b1e7e1',[0,.455,0],bucket);lip.rotation.x=Math.PI/2;const handle=mesh(new THREE.TorusGeometry(.29,.015,6,24,Math.PI),'#466b68',[0,.44,0],bucket);mesh(new THREE.CylinderGeometry(.234,.234,.01,18),new THREE.MeshStandardMaterial({color:'#4e9fa4',roughness:.2}),[0,.18,0],bucket);
// Fish keep their own heading and react to nearby disturbances.
const fishes=[];function makeFish(color){const g=new THREE.Group();ellipsoid([0,0,0],[.21,.065,.075],color,g,10);const tail=new THREE.Group();tail.position.x=-.19;g.add(tail);const tg=new THREE.BufferGeometry();tg.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,-.13,.11,0,-.13,-.11,0],3));tg.computeVertexNormals();mesh(tg,new THREE.MeshStandardMaterial({color,side:THREE.DoubleSide}),[0,0,0],tail);const fin=mesh(new THREE.ConeGeometry(.06,.13,3),color,[-.02,.065,0],g);fin.rotation.z=.2;for(const z of [-.064,.064])ellipsoid([.13,.014,z],[.018,.018,.009],'#263b37',g,6);scene.add(g);return{g,tail,phase:rand()*6,speed:between(.17,.32),z:between(-3.1,3.4),offset:between(-1.12,1.12),panic:0};}
for(let i=0;i<19;i++)fishes.push(makeFish(['#e78235','#edb65a','#5a8d8d','#adc6aa'][i%4]));
const rippleMaterial=new THREE.MeshBasicMaterial({color:'#e9ffef',transparent:true,opacity:.65,side:THREE.DoubleSide,depthWrite:false});const ripples=[];function ripple(x,z){for(let j=0;j<3;j++){const o=mesh(new THREE.RingGeometry(.94,1,56),rippleMaterial.clone(),[x,.155+j*.001,z]);o.rotation.x=-Math.PI/2;o.castShadow=false;o.renderOrder=4;ripples.push({o,age:-j*.23});}}
const motes=[];for(let i=0;i<23;i++){const o=ellipsoid([between(-5,5),between(.7,3.8),between(-3,3)],[.018,.018,.018],new THREE.MeshBasicMaterial({color:'#fff5c6'}),scene,5);o.castShadow=false;motes.push({o,p:o.position.clone(),phase:rand()*6});}
// Dragonfly hovering over the far bank.
const dragonfly=new THREE.Group();scene.add(dragonfly);rod([-.11,0,0],[.12,0,0],.016,'#2e8780',dragonfly);const wings=[];for(const side of [-1,1])for(const x of [-.035,.045]){const w=ellipsoid([x,.012,side*.09],[.055,.008,.11],new THREE.MeshStandardMaterial({color:'#deefe0',transparent:true,opacity:.65}),dragonfly,6);wings.push(w);}
let running=!matchMedia('(prefers-reduced-motion: reduce)').matches,time=0,last=performance.now(),flow=.4,scoopTime=-1,caught=0,scoopCandidate=null,bubbleUntil=4;let message='我看看…';
function say(text,duration=3){message=text;$('#bubble').textContent=text;bubbleUntil=time+duration;}
function pauseUI(){$('#pause').textContent=running?'Ⅱ':'▷';$('#pause').setAttribute('aria-label',running?'暂停动画':'继续动画');$('#pause').setAttribute('aria-pressed',String(!running));}pauseUI();
function scoop(){if(scoopTime>=0)return;if(!running){running=true;pauseUI();}scoopTime=0;$('#scoop').disabled=true;say('看我的！',2);scoopCandidate=null;}
$('#scoop').addEventListener('click',scoop);$('#pause').addEventListener('click',()=>{running=!running;pauseUI();});$('#reset').addEventListener('click',resetCamera);
$('#flow').addEventListener('input',e=>{flow=e.target.value/100;$('#flow-value').textContent=flow<.3?'慢悠悠':flow<.7?'轻轻的':'哗啦啦';});$('#sun').addEventListener('input',e=>{const v=e.target.value/100;sun.intensity=1.35+v*2.4;sun.color.set(v<.35?'#ffc486':'#fff2cf');hemi.intensity=.85+v*.65;environment.setSun(v);$('#sun-value').textContent=v<.35?'傍晚':v<.8?'午后':'晴天';});
$('#photo').addEventListener('click',()=>{environment.render(camera);canvas.toBlob(blob=>{if(!blob){say('暂时无法保存，请再试一次');return;}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='75-fishing.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);say('把这一刻留下来。');},'image/png');});
const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let down=null;
canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});canvas.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>6){down=null;return;}down=null;pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);ray.setFromCamera(pointer,camera);if(ray.intersectObject(girl,true).length){scoop();return;}const hit=ray.intersectObject(water)[0];if(hit&&environment.isWater(hit.point.x,hit.point.z)){if(!running){running=true;pauseUI();}ripple(hit.point.x,hit.point.z);fishes.forEach(f=>{if(f.g.position.distanceTo(hit.point)<2)f.panic=1;});}});
canvas.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();running=!running;pauseUI();}if(e.key.toLowerCase()==='r')resetCamera();if(e.key==='Enter')scoop();if(e.key.startsWith('Arrow')){e.preventDefault();const offset=camera.position.clone().sub(controls.target),s=new THREE.Spherical().setFromVector3(offset);if(e.key==='ArrowLeft')s.theta-=.12;if(e.key==='ArrowRight')s.theta+=.12;if(e.key==='ArrowUp')s.phi=Math.max(.28,s.phi-.08);if(e.key==='ArrowDown')s.phi=Math.min(Math.PI*.465,s.phi+.08);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(s));controls.update();}});
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);}addEventListener('resize',resize);
let lastNetPos=new THREE.Vector3();
function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.04);last=now;if(running)time+=dt;const step=running?dt:0;controls.update();
environment.update(time,flow);
if(scoopTime>=0){scoopTime+=step;const u=scoopTime;rightArm.rotation.z=u<.5?-.22*Math.sin(u/.5*Math.PI/2):u<1.1?-.22+.95*Math.sin((u-.5)/.6*Math.PI/2):u<2?.73:.73*(1-THREE.MathUtils.smoothstep(u,2,3));girl.rotation.z=-rightArm.rotation.z*.07;netGroup.getWorldPosition(lastNetPos);
if(u>.6&&u-step<=.6){const p=netGroup.localToWorld(netCenter.clone());ripple(p.x,p.z);let nearest=null,distance=1.2;fishes.forEach(f=>{const d=Math.hypot(f.g.position.x-p.x,f.g.position.z-p.z);if(d<distance){distance=d;nearest=f;}f.panic=.7;});scoopCandidate=nearest;}
if(u>1.3&&u-step<=1.3){if(scoopCandidate){caught++;$('#count').textContent=caught;say('捞到啦！',2.8);scoopCandidate.g.visible=true;}else say('咦？又跑掉了…',2.8);}
if(u>3){scoopTime=-1;rightArm.rotation.z=0;girl.rotation.z=0;$('#scoop').disabled=false;if(scoopCandidate){scoopCandidate.g.visible=true;scoopCandidate.z=-3.2;scoopCandidate=null;}}}
updateCharacter(time,scoopTime,scoopTime>1.3&&!!scoopCandidate);
for(const f of fishes){f.phase+=step*f.speed*(.5+flow*1.5)*(1+f.panic*3);f.panic=Math.max(0,f.panic-step*.6);const z=Math.sin(f.phase)*3.55,x=riverX(z)+f.offset+Math.sin(f.phase*2.7+f.z)*.2;const nextZ=Math.sin(f.phase+.01)*3.55,nextX=riverX(nextZ)+f.offset+Math.sin((f.phase+.01)*2.7+f.z)*.2;f.g.position.set(x,Math.max(groundHeight(x,z)+.10,-.07+Math.sin(time*2+f.z)*.02),z);if(f===scoopCandidate&&scoopTime>1.3){f.g.position.copy(netGroup.localToWorld(netCenter.clone().add(new THREE.Vector3(0,-.25,0))));}f.g.rotation.y=-Math.atan2(nextZ-z,nextX-x);f.tail.rotation.y=Math.sin(time*(9+f.panic*9)+f.z)*.45;}
for(let i=ripples.length-1;i>=0;i--){const r=ripples[i];r.age+=step;r.o.visible=r.age>=0;const s=Math.max(.01,r.age*.8);r.o.scale.setScalar(s);r.o.material.opacity=Math.max(0,.55-r.age*.3);if(r.age>1.85){scene.remove(r.o);r.o.geometry.dispose();r.o.material.dispose();ripples.splice(i,1);}}
for(const m of motes){m.o.position.set(m.p.x+Math.sin(time*.4+m.phase)*.3,m.p.y+Math.sin(time*.7+m.phase)*.18,m.p.z+Math.cos(time*.3+m.phase)*.2);}
dragonfly.position.set(1.7+Math.sin(time*.7)*.5,1.2+Math.sin(time*1.1)*.12,-1.2+Math.cos(time*.7)*.4);dragonfly.rotation.y=-time*.7;wings.forEach((w,i)=>w.rotation.x=Math.sin(time*70+i)*.5);
const anchor=girl.localToWorld(new THREE.Vector3(.3,3.4,.15)).project(camera);$('#bubble').style.left=`${(anchor.x*.5+.5)*innerWidth}px`;$('#bubble').style.top=`${(-anchor.y*.5+.5)*innerHeight}px`;$('#bubble').style.opacity=time<bubbleUntil&&anchor.z<1?1:0;
environment.render(camera);}
requestAnimationFrame(animate);$('#loading').style.opacity=0;setTimeout(()=>$('#loading').remove(),600);
