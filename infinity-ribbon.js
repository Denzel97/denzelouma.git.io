/**
 * Denzel Ouma Opondo portfolio — sculptural infinity ribbon.
 * Procedural, interactive three-dimensional bronze Möbius-inspired figure-eight.
 * Real curved surface geometry, rounded metal edges, studio environment,
 * brushed anisotropic micro-detail, wireframe globe and orbiting brass spheres.
 *
 * No AI image used as the rendered model. Screenshot reference is an intentional
 * static fallback only, preserving the artwork when WebGL is unavailable.
 */
export async function mountInfinityRibbon({stage,canvas,reducedMotion=false}) {
  if (!stage || !canvas) return;
  const T=await import('https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js');
  const renderer=new T.WebGLRenderer({
    canvas,alpha:true,antialias:true,powerPreference:'high-performance',
    preserveDrawingBuffer:false
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<700?1.6:2));
  renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.20;
  const scene=new T.Scene();
  const camera=new T.PerspectiveCamera(35,1,.1,80);
  scene.add(new T.HemisphereLight(0xffedda,0x163a2a,1.3));
  scene.add(new T.AmbientLight(0xb9a897,.35));
  const key=new T.PointLight(0xffe6c4,160,28);key.position.set(-3.4,4.8,6.2);scene.add(key);
  const sweep=new T.PointLight(0xfff0df,125,28);sweep.position.set(3.8,1.8,4.5);scene.add(sweep);
  const bronzeRim=new T.PointLight(0xf5a96d,105,30);bronzeRim.position.set(-3,-4,-3);scene.add(bronzeRim);
  const tealRim=new T.PointLight(0xa7caba,60,28);tealRim.position.set(4,-2,-4);scene.add(tealRim);

  // Studio-lighted environment matters for metallic PBR: without it copper looks black.
  function environment(){
    const c=document.createElement('canvas');c.width=1024;c.height=512;
    const g=c.getContext('2d'),grad=g.createLinearGradient(0,0,0,512);
    grad.addColorStop(0,'#363b3a');grad.addColorStop(.33,'#8d8474');
    grad.addColorStop(.56,'#302d28');grad.addColorStop(.81,'#74604b');
    grad.addColorStop(1,'#101e18');g.fillStyle=grad;g.fillRect(0,0,1024,512);
    const panels=[
      [68,42,78,370,'rgba(255,238,212,.98)'],
      [287,8,115,265,'rgba(255,248,236,.94)'],
      [483,135,35,290,'rgba(246,199,145,.87)'],
      [641,0,125,415,'rgba(255,237,208,.93)'],
      [898,66,50,320,'rgba(255,220,181,.75)']
    ];
    for(const [x,y,w,h,color] of panels){
      g.save();g.shadowColor='rgba(255,221,164,.80)';g.shadowBlur=38;
      g.fillStyle=color;g.fillRect(x,y,w,h);g.restore();
    }
    g.fillStyle='rgba(15,29,24,.84)';
    g.fillRect(177,0,51,512);g.fillRect(800,0,44,512);
    const tex=new T.CanvasTexture(c);
    tex.mapping=T.EquirectangularReflectionMapping;
    tex.colorSpace=T.SRGBColorSpace;
    const pmrem=new T.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const env=pmrem.fromEquirectangular(tex);
    scene.environment=env.texture;
    tex.dispose();pmrem.dispose();
    return env;
  }
  const env=environment();

  // Brushed microtexture aligned to the ribbon's direction of travel.
  function brushedTexture(){
    const c=document.createElement('canvas');c.width=1024;c.height=512;
    const g=c.getContext('2d');
    g.fillStyle='#e2e2e2';g.fillRect(0,0,c.width,c.height);
    let seed=15973;
    function random(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296}
    for(let i=0;i<1750;i++){
      let y=Math.floor(random()*512);
      let opacity=.018+random()*.055;
      g.fillStyle=random()>.5?'rgba(42,29,19,'+opacity+')':'rgba(255,255,247,'+opacity+')';
      g.fillRect(0,y,1024,random()>.9?2:1);
    }
    for(let i=0;i<120;i++){
      const y=Math.floor(random()*512);
      g.fillStyle='rgba(67,41,25,.025)';
      g.fillRect(Math.floor(random()*400),y,300+random()*600,1);
    }
    const t=new T.CanvasTexture(c);
    t.wrapS=T.RepeatWrapping;t.wrapT=T.RepeatWrapping;
    t.repeat.set(2.5,1);
    t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    return t;
  }
  const grain=brushedTexture();

  const group=new T.Group();group.scale.y=1.08;scene.add(group);
  const TAU=Math.PI*2;
  function center(t){
    return new T.Vector3(
      2.29*Math.sin(t),
      1.27*Math.sin(2*t),
      .49*Math.cos(t)+.23*Math.sin(2*t)
    );
  }
  function frame(t){
    const e=.0006,tangent=center(t+e).sub(center(t-e)).normalize();
    const xyNormal=new T.Vector3(-tangent.y,tangent.x,0).normalize();
    const twist=.92*Math.sin(t)+.51*Math.sin(2*t)+.11*Math.cos(t);
    const width=xyNormal.multiplyScalar(Math.cos(twist))
      .add(new T.Vector3(0,0,Math.sin(twist))).normalize();
    const depth=new T.Vector3().crossVectors(tangent,width).normalize();
    return {width,depth};
  }

  // A rounded rectangular extrusion along a true infinity-shaped 3D centreline.
  // This is wide sculpted *sheet metal*, not a circular torus tube.
  const N=512,halfWidth=.57,halfThickness=.06,bevel=.075;
  const profile=[
    [-halfWidth+bevel,halfThickness],
    [halfWidth-bevel,halfThickness],
    [halfWidth-bevel*.3,halfThickness*.94],
    [halfWidth,halfThickness*.4],
    [halfWidth,-halfThickness*.4],
    [halfWidth-bevel*.3,-halfThickness*.94],
    [halfWidth-bevel,-halfThickness],
    [-halfWidth+bevel,-halfThickness],
    [-halfWidth+bevel*.3,-halfThickness*.94],
    [-halfWidth,-halfThickness*.4],
    [-halfWidth,halfThickness*.4],
    [-halfWidth+bevel*.3,halfThickness*.94]
  ];
  const M=profile.length;
  const positions=[],uvs=[],indices=[];
  for(let i=0;i<=N;i++){
    const t=TAU*i/N,{width,depth}=frame(t),p=center(t);
    for(let k=0;k<M;k++){
      const [u,v]=profile[k],q=p.clone().addScaledVector(width,u).addScaledVector(depth,v);
      positions.push(q.x,q.y,q.z);
      uvs.push(i/N,k/M);
    }
  }
  for(let i=0;i<N;i++)for(let k=0;k<M;k++){
    const a=i*M+k,b=(i+1)*M+k,c=(i+1)*M+(k+1)%M,d=i*M+(k+1)%M;
    indices.push(a,b,d,b,c,d);
  }
  const geometry=new T.BufferGeometry();
  geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));
  geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const metal=new T.MeshPhysicalMaterial({
    color:0xb88961,metalness:.98,roughness:.33,
    roughnessMap:grain,envMapIntensity:1.78,
    clearcoat:.34,clearcoatRoughness:.21,
    side:T.DoubleSide
  });
  group.add(new T.Mesh(geometry,metal));

  // Crisp light-catching hems keep both rims visually articulated.
  const hemMaterial=new T.MeshPhysicalMaterial({
    color:0xe1b180,metalness:1,roughness:.22,
    envMapIntensity:1.75,clearcoat:.45
  });
  for(const sign of [-1,1]){
    const points=[];
    for(let i=0;i<230;i++){
      const t=TAU*i/230,{width}=frame(t);
      points.push(center(t).addScaledVector(width,sign*(halfWidth-.013)));
    }
    const path=new T.CatmullRomCurve3(points,true,'centripetal');
    group.add(new T.Mesh(new T.TubeGeometry(path,420,.015,7,true),hemMaterial));
  }

  // A slowly moving geometrical armature behind the ribbon.
  const edges=new T.EdgesGeometry(new T.IcosahedronGeometry(3.06,1));
  const wire=new T.LineSegments(edges,new T.LineBasicMaterial({
    color:0xb4a888,transparent:true,opacity:.18,depthWrite:false
  }));
  wire.scale.set(1,.83,.77);
  wire.rotation.set(.19,.13,.1);
  wire.position.z=-.7;
  scene.add(wire);
  const ringCurve=new T.EllipseCurve(0,0,3.03,2.52,0,TAU,false,0);
  const ringPoints=ringCurve.getPoints(260).map(p=>new T.Vector3(p.x,p.y,-.98));
  const ringGeometry=new T.BufferGeometry().setFromPoints(ringPoints);
  const ring=new T.LineLoop(ringGeometry,new T.LineBasicMaterial({
    color:0xd0b37e,transparent:true,opacity:.28
  }));
  scene.add(ring);

  // Orbit markers from the reference's geometric construction.
  const markerMaterial=new T.MeshPhysicalMaterial({
    color:0xeccba6,metalness:.92,roughness:.18,envMapIntensity:2.7,clearcoat:1
  });
  const bright=new T.Mesh(new T.SphereGeometry(.17,36,24),markerMaterial);
  bright.position.set(2.75,1.36,1.15);scene.add(bright);
  const small=new T.Mesh(new T.SphereGeometry(.125,28,20),markerMaterial);
  small.position.set(-2.39,-1.65,.94);scene.add(small);
  const points=[];
  for(const a of [.61,1.15,2.65,4.12,5.39]){
    points.push(3.03*Math.cos(a),2.52*Math.sin(a),-.91);
  }
  const stars=new T.BufferGeometry();stars.setAttribute('position',new T.Float32BufferAttribute(points,3));
  scene.add(new T.Points(stars,new T.PointsMaterial({
    color:0xffe1ae,size:.075,transparent:true,opacity:.96,sizeAttenuation:true
  })));
  const cluster=[];
  let rng=31875;
  function rand(){rng=(rng*16807)%2147483647;return rng/2147483647}
  for(let i=0;i<56;i++){
    const t=rand()*TAU,r=2.8+rand()*.7;
    cluster.push(r*Math.cos(t),.85*r*Math.sin(t),-1.5);
  }
  const dust=new T.BufferGeometry();
  dust.setAttribute('position',new T.Float32BufferAttribute(cluster,3));
  scene.add(new T.Points(dust,new T.PointsMaterial({
    color:0xe0c08c,size:.018,opacity:.48,transparent:true
  })));

  const state={yaw:-.13,pitch:.14,targetYaw:-.13,targetPitch:.14,
    pointerDown:false,px:0,py:0,visible:true,disposed:false};
  group.rotation.y=state.yaw;group.rotation.x=state.pitch;
  stage.tabIndex=0;
  stage.setAttribute('aria-label',
    'Interactive three-dimensional, brushed-bronze infinity ribbon; drag horizontally or use arrow keys to explore');
  stage.style.touchAction='pan-y';
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  function pointerDown(e){
    if(e.button!==undefined&&e.button!==0)return;
    state.pointerDown=true;state.px=e.clientX;state.py=e.clientY;
    try{stage.setPointerCapture(e.pointerId)}catch(_){}
  }
  function pointerMove(e){
    if(!state.pointerDown)return;
    const dx=e.clientX-state.px,dy=e.clientY-state.py;
    state.px=e.clientX;state.py=e.clientY;
    state.targetYaw=clamp(state.targetYaw+dx*.004,-.57,.57);
    state.targetPitch=clamp(state.targetPitch+dy*.003,-.31,.42);
  }
  function pointerUp(e){state.pointerDown=false;try{stage.releasePointerCapture(e.pointerId)}catch(_){}}
  function keydown(e){
    let moved=true;
    if(e.key==='ArrowLeft')state.targetYaw=clamp(state.targetYaw-.085,-.57,.57);
    else if(e.key==='ArrowRight')state.targetYaw=clamp(state.targetYaw+.085,-.57,.57);
    else if(e.key==='ArrowUp')state.targetPitch=clamp(state.targetPitch-.065,-.31,.42);
    else if(e.key==='ArrowDown')state.targetPitch=clamp(state.targetPitch+.065,-.31,.42);
    else if(e.key==='Home'){state.targetYaw=-.13;state.targetPitch=.14}
    else moved=false;
    if(moved){e.preventDefault();renderFrame()}
  }
  stage.addEventListener('pointerdown',pointerDown);
  stage.addEventListener('pointermove',pointerMove);
  stage.addEventListener('pointerup',pointerUp);
  stage.addEventListener('pointercancel',pointerUp);
  stage.addEventListener('keydown',keydown);

  function resize(){
    if(state.disposed)return;
    const rect=stage.getBoundingClientRect(),w=Math.max(1,Math.round(rect.width)),h=Math.max(1,Math.round(rect.height));
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    const halfFov=Math.tan((camera.fov*Math.PI/180)/2);
    camera.position.set(0,0,Math.max(8.4,6.2/(2*halfFov*camera.aspect*.90),4.5/(2*halfFov*.89)));
    camera.lookAt(0,0,0);
    camera.updateProjectionMatrix();
    renderFrame();
  }
  function renderFrame(){
    if(state.disposed)return;
    group.rotation.y=state.yaw;
    group.rotation.x=state.pitch;
    group.rotation.z=.035;
    renderer.render(scene,camera);
  }
  const resizeObserver=new ResizeObserver(resize);
  resizeObserver.observe(stage);
  resize();
  const visibility=new IntersectionObserver(entries=>{state.visible=entries.some(e=>e.isIntersecting)},{threshold:0});
  visibility.observe(stage);
  stage.classList.add('has-webgl');
  stage.dataset.model='infinity-ribbon';
  const start=performance.now();
  function animate(now){
    if(state.disposed)return;
    requestAnimationFrame(animate);
    if(!state.visible||document.hidden)return;
    const t=(now-start)/1000;
    const damping=.065;
    state.yaw+=(state.targetYaw-state.yaw)*damping;
    state.pitch+=(state.targetPitch-state.pitch)*damping;
    group.rotation.y=state.yaw+(!reducedMotion?Math.sin(t*.24)*.036:0);
    group.rotation.x=state.pitch+(!reducedMotion?Math.sin(t*.19)*.025:0);
    group.rotation.z=.035+(!reducedMotion?Math.sin(t*.17)*.014:0);
    if(!reducedMotion){wire.rotation.y=.13+t*.028;bright.position.y=1.36+Math.sin(t*.49)*.06}
    renderer.render(scene,camera);
  }
  if(!reducedMotion)requestAnimationFrame(animate);
  window.addEventListener('pagehide',()=>{
    if(state.disposed)return;
    state.disposed=true;
    resizeObserver.disconnect();visibility.disconnect();
    geometry.dispose();grain.dispose();env.dispose();
    renderer.dispose();
  },{once:true});
}