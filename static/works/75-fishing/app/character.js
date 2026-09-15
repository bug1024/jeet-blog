import * as THREE from 'three';

// Reference: 75's two short tied-back pigtails with loose fringe, confident pixel eyes,
// white T-shirt, charcoal straps, one-piece orange waders and cobalt rain boots.
export function create75(scene) {
  const palette = {
    skin: '#ffc18c', hair: '#45251e', hairLight: '#68402d',
    orange: '#f56616', seam: '#d64b0c', blue: '#097cce',
    sole: '#0767b2', shirt: '#fff9ee', strap: '#38433d',
  };
  const materials = new Map();
  function material(color) {
    if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({
      color, roughness: .88, metalness: 0,
    }));
    const result = materials.get(color);
    if (color === palette.skin) {result.emissive.set('#b96d44'); result.emissiveIntensity = .16;}
    return result;
  }
  function add(geometry, color, parent, position = [0, 0, 0]) {
    const item = new THREE.Mesh(geometry, typeof color === 'string' ? material(color) : color);
    item.position.set(...position); item.castShadow = true; item.receiveShadow = true;
    parent.add(item); return item;
  }
  function oval(position, scale, color, parent) {
    const item = add(new THREE.SphereGeometry(1, 24, 16), color, parent, position);
    item.scale.set(...scale); return item;
  }
  function segment(a, b, radius, color, parent, top = radius) {
    const item = add(new THREE.CylinderGeometry(top, radius, 1, 12), color, parent);
    positionSegment(item, a, b); return item;
  }
  function positionSegment(item, a, b) {
    const from = new THREE.Vector3(...a), to = new THREE.Vector3(...b);
    item.position.copy(from).add(to).multiplyScalar(.5);
    item.scale.y = from.distanceTo(to);
    item.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.sub(from).normalize());
  }
  function shapeMesh(points, depth, color, parent, position) {
    const shape = new THREE.Shape();
    points.forEach(([x, y], i) => i ? shape.lineTo(x, y) : shape.moveTo(x, y));
    shape.closePath();
    return add(new THREE.ExtrudeGeometry(shape, {depth, bevelEnabled: true,
      bevelThickness: .015, bevelSize: .015, bevelSegments: 2, steps: 1}), color, parent, position);
  }
  const girl = new THREE.Group();
  girl.position.set(-1.63, .40, .48); girl.rotation.y = .27; scene.add(girl);
  oval([0, -.025, 0], [.83, .18, .63], '#c3c7ac', girl);

  // A longer three-and-a-half-head silhouette, with bent knees and a wide stance.
  for (const side of [-1, 1]) {
    const leg = new THREE.Group(); girl.add(leg);
    const cuff = add(new THREE.CylinderGeometry(.197, .19, .095, 16), palette.seam, leg,
      [side * .31, .51, .1]); cuff.rotation.z = side * .06;
    add(new THREE.CylinderGeometry(.179, .172, .34, 20), palette.blue, leg,
      [side * .31, .31, .10]);
    oval([side * .31, .17, .235], [.189, .155, .31], palette.blue, leg);
    oval([side * .31, .065, .22], [.197, .065, .31], palette.sole, leg);
    // Small folds in the trousers, not blocks on the silhouette.
    segment([side * .31 - .10, .68, .278], [side * .31 + .095, .65, .278],
      .013, palette.seam, leg);
  }

  const torso = new THREE.Group(); torso.position.set(0, 1.16, 0);
  torso.rotation.x = .11; girl.add(torso);

  oval([0, .62, -.015], [.37, .48, .22], palette.shirt, torso);
  // A single connected garment mesh runs from the chest through the hips
  // and branches at the crotch into both trouser legs. There is no waist seam.
  const garmentVertices = [], garmentFaces = [], vertexLookup = new Map();
  const segments = 64;
  function garmentVertex(x, y, z) {
    const weight = THREE.MathUtils.smoothstep(y, 1.05, 1.30);
    const angle = .11 * weight, h = y - 1.16;
    const p = [x, 1.16 + h * Math.cos(angle) - z * Math.sin(angle),
      h * Math.sin(angle) + z * Math.cos(angle)];
    const key = p.map(v=>v.toFixed(6)).join(',');
    if(vertexLookup.has(key)) return vertexLookup.get(key);
    const index=garmentVertices.length/3;garmentVertices.push(...p);
    vertexLookup.set(key,index);return index;
  }
  function ringAt(fn) {
    return Array.from({length:segments+1},(_,i)=>garmentVertex(...fn(i/segments*Math.PI*2)));
  }
  function connectRings(a,b,reverse=false) {
    for(let i=0;i<segments;i++) {
      const f=[a[i],b[i],a[i+1],b[i],b[i+1],a[i+1]];
      if(reverse) for(let j=0;j<6;j+=3) garmentFaces.push(f[j],f[j+2],f[j+1]);
      else garmentFaces.push(...f);
    }
  }
  const bodySections=[[1.26,.45,.26],[1.43,.441,.269],[1.62,.412,.272],[1.79,.39,.255]];
  const bodyRings=bodySections.map(([y,rx,rz])=>ringAt(a=>[Math.sin(a)*rx,y,Math.cos(a)*rz]));
  const bibTop=ringAt(a=>[Math.sin(a)*.371,
    1.74+Math.max(0,Math.cos(a))**2*.25+Math.max(0,-Math.cos(a))**2*.10,
    Math.cos(a)*.247]);
  // The last body ring follows the top edge, without reversing over its lower side openings.
  bodyRings[3]=ringAt(a=>[Math.sin(a)*.39,1.69+Math.max(0,Math.cos(a))**2*.10,Math.cos(a)*.255]);
  bodyRings.push(bibTop);
  for(let i=0;i<bodyRings.length-1;i++)connectRings(bodyRings[i],bodyRings[i+1],true);
  for(const side of [-1,1]) {
    const splitRing=ringAt(a=>{
      const outer=Math.max(0,Math.sin(a));
      return [side*.45*outer,1.26+Math.min(0,Math.sin(a))*.20,Math.cos(a)*.26];
    });
    const legSections=[[1.04,.258,.229,.04],[.90,.316,.225,.13],
      [.73,.326,.208,.135],[.51,.31,.185,.10]];
    const legRings=[splitRing,...legSections.map(([y,x,r,z])=>ringAt(a=>
      [side*(x+Math.sin(a)*r),y,z+Math.cos(a)*r*.96]))];
    for(let i=0;i<legRings.length-1;i++)connectRings(legRings[i],legRings[i+1],side===-1);
  }
  const garment=new THREE.BufferGeometry();
  garment.setAttribute('position',new THREE.Float32BufferAttribute(garmentVertices,3));
  garment.setIndex(garmentFaces);garment.computeVertexNormals();
  const garmentMaterial=material(palette.orange).clone();garmentMaterial.side=THREE.DoubleSide;
  add(garment,garmentMaterial,girl);
  // The chest pocket is a stitched opening, not a separate shirt hem.
  segment([-.145,.49,.277],[.145,.49,.277],.011,palette.seam,torso);
  segment([.05,.47,.277],[.05,.28,.275],.009,palette.seam,torso);
  shapeMesh([[-.04,-.018],[.04,-.018],[.04,.018],[-.04,.018]],.003,
    palette.strap,torso,[.265,.32,.235]);
  for (const side of [-1, 1]) {
    const strap = shapeMesh([[-.046, -.20], [.046, -.20], [.046, .20], [-.046, .20]],
      .021, palette.strap, torso, [side * .255, .88, .198]);
    strap.rotation.z = side * -.14;
    segment([side * .25, 1.035, .17], [side * .27, .86, -.215], .046, palette.strap, torso);
    segment([side * .27, .86, -.215], [side * .23, .62, -.205], .037, palette.strap, torso);
    oval([side * .273, .704, .25], [.043, .04, .015], '#d6c2a0', torso);
    oval([side * .273, .708, .27], [.023, .023, .008], palette.strap, torso);
  }
  segment([0, .91, .0], [0, 1.15, .015], .135, palette.skin, torso);
  const collar = add(new THREE.TorusGeometry(.152, .025, 8, 24), '#dddccf', torso, [0, 1.0, .005]);
  collar.rotation.x = Math.PI / 2;

  const head = new THREE.Group(); head.position.set(0, 1.44, .10);
  head.rotation.set(.09, .10, -.04); torso.add(head);
  // Cross sections taper the cheeks into a small chin instead of a spherical toy face.
  const rings = [
    [-.51, .065, .075], [-.47, .20, .20], [-.37, .345, .285],
    [-.20, .46, .345], [0, .49, .373], [.22, .474, .374],
    [.40, .40, .32], [.52, .26, .235], [.58, .025, .03],
  ];
  function radii(y) {
    for (let i = 1; i < rings.length; i++) if (y <= rings[i][0]) {
      const t = THREE.MathUtils.clamp((y - rings[i - 1][0]) / (rings[i][0] - rings[i - 1][0]), 0, 1);
      return [THREE.MathUtils.lerp(rings[i - 1][1], rings[i][1], t),
        THREE.MathUtils.lerp(rings[i - 1][2], rings[i][2], t)];
    }
    return rings.at(-1).slice(1);
  }
  function faceZ(x, y) {
    const [rx, rz] = radii(y);
    return rz * Math.pow(Math.max(0, 1 - (x / rx) ** 2), .28);
  }
  const positions = [], indices = [];
  for (const [y, rx, rz] of rings) for (let i = 0; i <= 64; i++) {
    const a = i / 64 * Math.PI * 2, x = Math.cos(a) * rx;
    positions.push(x, y, Math.sin(a) >= 0 ? faceZ(x, y) : Math.sin(a) * rz * .92);
  }
  for (let r = 0; r < rings.length - 1; r++) for (let i = 0; i < 64; i++) {
    const a = r * 65 + i, b = a + 65; indices.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const faceGeometry = new THREE.BufferGeometry();
  faceGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  faceGeometry.setIndex(indices); faceGeometry.computeVertexNormals(); add(faceGeometry, palette.skin, head);
  for (const side of [-1, 1]) {
    oval([side * .482, -.085, -.005], [.079, .115, .076], palette.skin, head);
    oval([side * .528, -.083, .040], [.027, .058, .026], '#df9670', head);
  }
  oval([.025, -.13, .36], [.029, .033, .035], palette.skin, head);

  // Hair is swept back into two small low pigtails, with loose forehead and temple strands.
  const hp = [], hi = [], rows = 22, columns = 64;
  for (let r = 0; r <= rows; r++) for (let i = 0; i <= columns; i++) {
    const a = i / columns * Math.PI * 2, front = Math.max(0, Math.sin(a));
    const thetaMax = 1.87 - front ** .65 * .80;
    const theta = .008 + r / rows * thetaMax;
    hp.push(Math.cos(a) * Math.sin(theta) * .536,
      .04 + Math.cos(theta) * .605,
      (Math.sin(a) > 0 ? .015 : -.048) + Math.sin(a) * Math.sin(theta) * (Math.sin(a) > 0 ? .535 : .445));
  }
  for (let r = 0; r < rows; r++) for (let i = 0; i < columns; i++) {
    const a = r * (columns + 1) + i, b = a + columns + 1;
    hi.push(a, a + 1, b, b, a + 1, b + 1);
  }
  const capGeo = new THREE.BufferGeometry();
  capGeo.setAttribute('position', new THREE.Float32BufferAttribute(hp, 3));
  capGeo.setIndex(hi); capGeo.computeVertexNormals(); add(capGeo, palette.hair, head);

  // Two small short pigtails behind the ears; no bun or loose bob silhouette.
  for (const side of [-1, 1]) {
    const tail = new THREE.Group();
    tail.position.set(side * .365, -.105, -.365);head.add(tail);
    const tie = add(new THREE.TorusGeometry(.063,.017,8,24),'#272b26',tail);
    tie.rotation.x = Math.PI / 2;
    for (let strand=0;strand<4;strand++) {
      const offset=(strand-1.5)*.032;
      const curve=new THREE.CatmullRomCurve3([
        new THREE.Vector3(offset,0,0),
        new THREE.Vector3(offset+side*.035,-.105,-.035),
        new THREE.Vector3(offset+side*.075,-.215,-.014),
        new THREE.Vector3(offset+side*(.10+strand*.012),-.285+strand*.012,.01),
      ]);
      const geometry=new THREE.TubeGeometry(curve,20,1,8,false);
      const positions=geometry.attributes.position;
      for(let row=0;row<=20;row++) {
        const t=row/20,center=curve.getPointAt(t);
        const radius=.043*Math.pow(1-t,.60)+.003;
        for(let col=0;col<=8;col++) {
          const i=row*9+col;
          positions.setXYZ(i,center.x+(positions.getX(i)-center.x)*radius,
            center.y+(positions.getY(i)-center.y)*radius,
            center.z+(positions.getZ(i)-center.z)*radius);
        }
      }
      geometry.computeVertexNormals();add(geometry,strand%2?'#543025':palette.hair,tail);
    }
    // Fine highlights follow the swept-back direction towards each hair tie.
    for(let j=0;j<3;j++) {
      const points=[[side*.47,.12+j*.09,-.04],[side*.46,.06+j*.06,-.20],
        [side*.41,-.035+j*.02,-.31],[side*.365,-.105,-.365]];
      const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
      add(new THREE.TubeGeometry(curve,24,.005,5,false),'#70442f',head);
    }
  }

  // Curved tapered strips create swept, pointed locks rather than bead-like curls.
  function lock(points, width, color) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const vertices = [], faces = [], rows = 18, cols = 6;
    for (let i = 0; i <= rows; i++) {
      const t = i / rows, p = curve.getPoint(t), tangent = curve.getTangent(t);
      const across = new THREE.Vector3(tangent.y, -tangent.x, 0).normalize();
      const w = width * Math.pow(1 - t, .40) * (.12 + Math.sin(t * Math.PI) * 1.12) + .001;
      for (let j = 0; j <= cols; j++) {
        const u = j / cols * 2 - 1, q = p.clone().addScaledVector(across, w * u);
        if (q.y > .27) {
          q.y = Math.min(q.y, .63);
          const roof = Math.max(.001, 1 - ((q.y - .04) / .605) ** 2);
          const limit = .536 * Math.sqrt(roof);
          q.x = THREE.MathUtils.clamp(q.x, -limit * .98, limit * .98);
          const capZ = .015 + .535 * Math.sqrt(Math.max(0, roof - (q.x / .536) ** 2));
          q.z = capZ + .012;
        }
        q.z = Math.max(q.z, faceZ(q.x, q.y) + .014);
        q.z += Math.sin(j / cols * Math.PI) * .014 * (1 - t);
        vertices.push(q.x, q.y, q.z);
      }
    }
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
      const a = i * (cols + 1) + j, b = a + cols + 1;
      faces.push(a, b, a + 1, b, b + 1, a + 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    g.setIndex(faces); g.computeVertexNormals();
    const m = material(color).clone(); m.side = THREE.DoubleSide; add(g, m, head);
  }
  lock([[.20,.57,.19],[-.08,.48,.34],[-.36,.23,.34],[-.485,-.16,.13]], .20, '#4e2b22');
  lock([[.23,.57,.19],[.10,.46,.33],[-.08,.27,.394],[-.22,.13,.378]], .105, '#61382a');
  lock([[.30,.52,.19],[.23,.40,.34],[.11,.26,.39],[.03,.18,.383]], .067, '#4e2b22');
  lock([[.36,.46,.16],[.35,.33,.31],[.28,.22,.365],[.23,.15,.36]], .051, '#6b3c2a');
  lock([[.42,.38,.11],[.45,.18,.245],[.46,.025,.215],[.43,-.22,.15]], .063, '#512d22');
  lock([[-.46,.23,.13],[-.51,.05,.07],[-.515,-.15,.045],[-.47,-.28,.05]], .064, '#4b2921');
  lock([[.47,.13,-.05],[.51,-.03,-.04],[.49,-.23,-.035],[.44,-.34,-.03]], .072, '#4b2921');
  lock([[-.12,.60,.12],[-.28,.57,.19],[-.40,.46,.22],[-.47,.38,.20]], .025, '#513026');
  // Sparse curved highlights follow the growth direction, as in the pixel reference.
  for (const path of [
    [[.12,.594,.185],[-.06,.53,.31],[-.26,.35,.357]],
    [[-.05,.599,.17],[-.22,.52,.28],[-.40,.31,.28]],
    [[.34,.51,.18],[.40,.38,.25],[.44,.28,.255]],
  ]) {
    const curve = new THREE.CatmullRomCurve3(path.map(p => new THREE.Vector3(...p)));
    add(new THREE.TubeGeometry(curve, 18, .007, 5, false), '#80503a', head);
  }

  // Pixel graphics are conformed to the sculpted face, retaining 75's original eye language.
  const textures = {};
  function faceTexture(mood, blink) {
    const key = `${mood}-${blink}`; if (textures[key]) return textures[key];
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const poly = (points, color) => {ctx.fillStyle = color; ctx.beginPath();
      points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y)); ctx.closePath(); ctx.fill();};
    ctx.fillStyle = '#ef9873'; ctx.fillRect(12,77,15,4); ctx.fillRect(101,77,15,4);
    // Broad, slightly angled upper lids and black square pupils.
    for (const center of [35,94]) {
      const side = center < 64 ? -1 : 1;
      if (blink) { poly([[center-11,65],[center+10,67],[center+10,70],[center-11,68]], '#493124'); }
      else {
        poly([[center-12,55],[center+11,58],[center+9,74],[center-10,74]], '#fff8e9');
        ctx.fillStyle='#38261f'; ctx.fillRect(center-4+(mood==='focus'?3:0),59,11,16);
        poly([[center-13,53],[center+12,56],[center+12,60],[center-13,57]], '#462b21');
      }
      const tilt = mood === 'focus' ? side * -4 : side * 2;
      poly([[center-11,40-tilt],[center+9,40+tilt],[center+9,43+tilt],[center-11,43-tilt]], '#70432e');
    }
    if (mood === 'happy') {
      poly([[52,88],[77,87],[74,97],[68,101],[59,98]], '#a94928');
      ctx.fillStyle='#ef8754';ctx.fillRect(60,96,12,3);
    } else {
      poly([[55,90],[64,93],[74,90],[77,87],[75,93],[65,96],[57,94]], '#a95a37');
    }
    const texture = new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;
    texture.magFilter=THREE.NearestFilter;texture.minFilter=THREE.LinearFilter;
    textures[key]=texture;return texture;
  }
  const decalGeo = new THREE.PlaneGeometry(.87,.72,40,40);
  const dp = decalGeo.attributes.position;
  for(let i=0;i<dp.count;i++) {
    const x=dp.getX(i), y=dp.getY(i)-.035;
    dp.setXYZ(i,x,y,faceZ(x,y)+.008);
  }
  decalGeo.computeVertexNormals();
  const expressionMaterial = new THREE.MeshBasicMaterial({map:faceTexture('focus',false),
    transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,toneMapped:false});
  const expression=add(decalGeo,expressionMaterial,head);expression.castShadow=false;
  expression.renderOrder=1;

  // The hands follow the same net rig, so both grips remain attached during scooping.
  const rightArm = new THREE.Group(); rightArm.position.set(.36,.43,.49);torso.add(rightArm);
  const netGroup = new THREE.Group();rightArm.add(netGroup);
  const netCenter = new THREE.Vector3(1.55,-1.53,.17);
  segment([-.31,.20,-.035],netCenter.toArray(),.028,'#946734',netGroup);
  segment([-.31,.20,-.035],[.10,-.08,.015],.032,'#76502d',netGroup);
  const hoop=add(new THREE.TorusGeometry(.46,.024,10,56),'#b29158',netGroup,netCenter.toArray());
  hoop.rotation.x=Math.PI/2;
  const thread=new THREE.LineBasicMaterial({color:'#f3f5df',transparent:true,opacity:.85});
  for(let k=0;k<22;k++) {
    const a=k*Math.PI/11, points=[];
    for(let j=0;j<=12;j++) {const t=j/12,r=.46*(1-t*.83);
      points.push(new THREE.Vector3(netCenter.x+Math.cos(a)*r,netCenter.y-.40*Math.sin(t*Math.PI/2),netCenter.z+Math.sin(a)*r));}
    netGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),thread));
  }
  for(let j=1;j<9;j++) {
    const t=j/9,r=.46*(1-t*.83),points=[];
    for(let k=0;k<=48;k++){const a=k*Math.PI/24;points.push(new THREE.Vector3(netCenter.x+Math.cos(a)*r,netCenter.y-.40*Math.sin(t*Math.PI/2),netCenter.z+Math.sin(a)*r));}
    netGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),thread));
  }
  const arms = [-1,1].map(side=>({
    side, shoulder:[side*.37,.83,.005],
    sleeve:segment([0,0,0],[0,1,0],.14,palette.shirt,torso,.17),
    upper:segment([0,0,0],[0,1,0],.089,palette.skin,torso,.102),
    forearm:segment([0,0,0],[0,1,0],.079,palette.skin,torso,.091),
    elbow:oval([0,0,0],[.094,.097,.09],palette.skin,torso),
    hand:oval([0,0,0],[.10,.086,.105],palette.skin,torso),
  }));
  const grip = new THREE.Vector3();
  function updateCharacter(time, scoopTime, success) {
    head.position.y=1.44+Math.sin(time*2)*.009;
    head.rotation.x=.035+(scoopTime>=0?Math.sin(scoopTime*2)*.055:0);
    head.rotation.y=.13+Math.sin(time*.45)*.035;
    head.rotation.z=-.045+Math.sin(time*.75)*.018;
    const blink=time%4.7>4.53;
    expressionMaterial.map=faceTexture(success?'happy':'focus',blink);
    // Net first, then arm endpoints; no detached second hand during the lift.
    girl.updateWorldMatrix(true,true);
    for(const arm of arms) {
      grip.set(arm.side<0?-.27:.02,arm.side<0?.17:-.015,arm.side<0?-.03:.0);
      netGroup.localToWorld(grip);torso.worldToLocal(grip);
      const hand=grip.toArray();
      const elbow=[arm.side<0?-.40:.57,.40,arm.side<0?.24:.23];
      const sleeveEnd=arm.shoulder.map((v,i)=>THREE.MathUtils.lerp(v,elbow[i],.61));
      positionSegment(arm.sleeve,arm.shoulder,sleeveEnd);
      positionSegment(arm.upper,sleeveEnd,elbow);
      positionSegment(arm.forearm,elbow,hand);
      arm.elbow.position.set(...elbow);arm.hand.position.copy(grip);
    }
  }
  updateCharacter(0,-1,false);
  return {girl,head,rightArm,netGroup,netCenter,updateCharacter};
}
