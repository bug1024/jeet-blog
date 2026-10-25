import * as THREE from 'three';

export const WATER_LEVEL = .135;
// Wind blows from the far-left bank toward the near-right one.
export const WIND_DIRECTION = new THREE.Vector2(.94, .34).normalize();
export const riverX = z => Math.sin(z * .65) * .75;
const widthAt = z => 1.66 + Math.sin(z * 1.12 + .7) * .15;
const smooth = THREE.MathUtils.smoothstep;
export function groundHeight(x, z) {
  const distance = Math.abs(x - riverX(z)) / widthAt(z);
  const pool = -.49 - .13 * Math.exp(-((z - .6) ** 2) / 2.2);
  const shelves = .065 * Math.sin(z * 2.1 + x * 1.7);
  const bank = .48 + .055 * Math.sin(x * 1.8 + z) * Math.cos(z * 1.3)
    + Math.max(0, -z - 2.3) * .12;
  return THREE.MathUtils.lerp(pool + shelves, bank, smooth(distance, .62, 1.50));
}

// Local procedural assets: no network textures or postprocessing dependencies.
export function createEnvironment(scene, renderer) {
  let seed = 75421;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const range = (a, b) => a + (b - a) * random();
  const inside = (x, z, margin = 1) => (x / (6.3 * margin)) ** 2 + (z / (4.8 * margin)) ** 2 < 1;
  const animatedMaterials = [];
  // One set of weather uniforms shared by every material that reacts to rain or wind.
  const weather = {
    uWet: {value: 0}, uWind: {value: 0}, uFlutter: {value: 0},
    uWindDir: {value: new THREE.Vector2(WIND_DIRECTION.x, WIND_DIRECTION.y)},
  };
  const captureHidden = [];
  const surfaceVertex = `varying vec3 vNaturePosition;`;
  const noiseGLSL = `
    float natureHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
    float natureNoise(vec3 p){
      vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
      return mix(mix(mix(natureHash(i),natureHash(i+vec3(1,0,0)),f.x),
        mix(natureHash(i+vec3(0,1,0)),natureHash(i+vec3(1,1,0)),f.x),f.y),
        mix(mix(natureHash(i+vec3(0,0,1)),natureHash(i+vec3(1,0,1)),f.x),
        mix(natureHash(i+vec3(0,1,1)),natureHash(i+vec3(1,1,1)),f.x),f.y),f.z);
    }
    float creekCaustic(vec2 p,float t){
      vec2 q=p*8.0+vec2(sin(p.y*3.0-t*.8),sin(p.x*3.6+t*.6))*.6;
      float a=sin(q.x+t*.8)+sin(q.y-t*.6);
      float b=sin(q.x*.82-q.y*.69+t*.4);
      return pow(max(0.0,1.0-abs(a+b)*2.8),8.0);
    }`;
  function naturalMaterial(color, type = 'stone') {
    const m = new THREE.MeshStandardMaterial({color, roughness: type === 'soil' ? 1 : .87});
    m.customProgramCacheKey = () => 'creek-surface-' + type;
    m.onBeforeCompile = shader => {
      shader.uniforms.uNatureTime = {value: 0};shader.uniforms.uWet = weather.uWet;
      shader.vertexShader = surfaceVertex + '\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', `
        #include <project_vertex>
        vec4 naturePoint=vec4(transformed,1.0);
        #ifdef USE_INSTANCING
          naturePoint=instanceMatrix*naturePoint;
        #endif
        vNaturePosition=(modelMatrix*naturePoint).xyz;`);
      shader.fragmentShader = `varying vec3 vNaturePosition;uniform float uNatureTime,uWet;${noiseGLSL}\n` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
        #include <color_fragment>
        float grain=natureNoise(vNaturePosition*${type === 'bark' ? 'vec3(32.0,2.5,32.0)' : '9.0'});
        float fineGrain=natureNoise(vNaturePosition*58.0);
        diffuseColor.rgb*=.83+grain*.25+fineGrain*.08;
        ${['bark', 'plinth'].includes(type) ? '' : `
          float wet=1.0-smoothstep(.12,.33,vNaturePosition.y);
          diffuseColor.rgb*=mix(1.0,.72,wet);
          float submerged=1.0-smoothstep(.10,.14,vNaturePosition.y);
          diffuseColor.rgb+=vec3(.16,.20,.10)*creekCaustic(vNaturePosition.xz,uNatureTime)*submerged*(1.0-uWet*.6);
        `}
        diffuseColor.rgb*=mix(1.0,${type === 'soil' ? '.80' : type === 'stone' ? '.74' : '.84'},uWet*(.75+.25*fineGrain));`);
      shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', `
        #include <roughnessmap_fragment>
        ${type === 'stone' ? 'roughnessFactor=mix(.29,.88,smoothstep(.10,.29,vNaturePosition.y));' : ''}
        roughnessFactor=mix(roughnessFactor,${type === 'soil' ? '.62' : '.22'},uWet*${type === 'soil' ? '.55' : '.85'});`);
      m.userData.shader = shader;
    };
    animatedMaterials.push(m); return m;
  }
  function mesh(geometry, material, position, parent = scene) {
    const o = new THREE.Mesh(geometry, material);
    o.position.set(...position); o.castShadow = o.receiveShadow = true; parent.add(o);return o;
  }
  const stoneMaterial = naturalMaterial('#a5a99b');
  const barkMaterial = naturalMaterial('#776247', 'bark');
  function rod(a, b, radius, material, parent = scene, top = radius * .7) {
    const p = new THREE.Vector3(...a), q = new THREE.Vector3(...b);
    const item = mesh(new THREE.CylinderGeometry(top, radius, p.distanceTo(q), 9), material,
      p.clone().add(q).multiplyScalar(.5).toArray(), parent);
    item.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), q.sub(p).normalize());return item;
  }

  const ground = new THREE.PlaneGeometry(12.6, 9.6, 144, 112);ground.rotateX(-Math.PI / 2);
  const positions = ground.attributes.position, colors = [], indices = [];
  const sand = new THREE.Color('#b6ae8a'), wetMud = new THREE.Color('#797858');
  const grassSoil = new THREE.Color('#7d9152'), color = new THREE.Color();
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), z = positions.getZ(i), y = groundHeight(x, z);
    positions.setY(i, y);
    color.copy(sand).lerp(wetMud, smooth(y, -.06, .19));
    color.lerp(grassSoil, smooth(y, .23, .49));
    color.multiplyScalar(.95 + random() * .10);colors.push(color.r, color.g, color.b);
  }
  const old = ground.index.array;
  for (let i = 0; i < old.length; i += 3) {
    if ([old[i], old[i + 1], old[i + 2]].every(j => inside(positions.getX(j), positions.getZ(j)))) {
      indices.push(old[i], old[i + 1], old[i + 2]);
    }
  }
  ground.setIndex(indices);ground.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));ground.computeVertexNormals();
  const terrainMaterial = naturalMaterial('#ffffff', 'soil');terrainMaterial.vertexColors = true;
  mesh(ground, terrainMaterial, [0, 0, 0]);
  // Close the terrain edge down to the plinth, including the creek's exposed cutaway.
  const edgePositions=[],edgeIndices=[],edgeColors=[];
  for(let i=0;i<=192;i++) {
    const a=i/192*Math.PI*2,x=Math.cos(a)*6.22,z=Math.sin(a)*4.73;
    const top=groundHeight(x,z)-.025;
    edgePositions.push(x,top,z,x,-1.42,z);
    const upper=new THREE.Color('#9e926d'),lower=new THREE.Color('#756b4d');
    edgeColors.push(upper.r,upper.g,upper.b,lower.r,lower.g,lower.b);
    if(i<192){const j=i*2;edgeIndices.push(j,j+2,j+1,j+2,j+3,j+1);}
  }
  const edgeGeometry=new THREE.BufferGeometry();
  edgeGeometry.setAttribute('position',new THREE.Float32BufferAttribute(edgePositions,3));
  edgeGeometry.setAttribute('color',new THREE.Float32BufferAttribute(edgeColors,3));
  edgeGeometry.setIndex(edgeIndices);edgeGeometry.computeVertexNormals();
  const edgeMaterial=naturalMaterial('#ffffff','plinth');edgeMaterial.vertexColors=true;
  mesh(edgeGeometry,edgeMaterial,[0,0,0]);
  const floor = mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({color: '#dce7df', roughness: 1}), [0, -1.43, 0]);
  floor.rotation.x = -Math.PI / 2;floor.castShadow = false;

  // Deformed, smooth pebbles share one mesh per size class instead of hundreds of draw calls.
  function rockGeometry(detail = 2) {
    const g = new THREE.IcosahedronGeometry(1, detail), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const displacement = 1 + .065 * Math.sin(x * 5 + z * 4) * Math.cos(y * 6 - z * 3);
      p.setXYZ(i, x * displacement, y * displacement, z * displacement);
    }
    g.computeVertexNormals();return g;
  }
  const rockMesh = new THREE.InstancedMesh(rockGeometry(), stoneMaterial, 360);
  const dummy = new THREE.Object3D(), rockColor = new THREE.Color();let rockCount = 0;
  const obstacles = [];
  const clumps = [-3.5, -1.35, .9, 3.2];
  for (let i = 0; i < 110; i++) {
    const z = i < 55 ? clumps[i % 4] + range(-.62, .62) : range(-4.4, 4.4);
    const side = random() < .5 ? -1 : 1;
    const x = riverX(z) + side * (widthAt(z) + range(-.20, .72));
    if (!inside(x, z, .97)) continue;
    // Keep 75's footing and the bucket readable.
    if (Math.hypot(x + 1.63, z - .48) < .60 || Math.hypot(x + 2.68, z - 1.1) < .35) continue;
    const r = i % 11 === 0 ? range(.40, .56) : range(.09, .29);
    const y = groundHeight(x, z) + r * .27;
    dummy.position.set(x, y, z);dummy.rotation.set(range(-.3, .3), range(0, 6.28), range(-.25, .25));
    dummy.scale.set(r * range(1, 1.6), r * range(.6, .95), r * range(.8, 1.3));dummy.updateMatrix();
    rockMesh.setMatrixAt(rockCount, dummy.matrix);
    rockColor.setHSL(range(.105, .155), range(.07, .17), range(.40, .63));rockMesh.setColorAt(rockCount++, rockColor);
    if (y - r < WATER_LEVEL && y + r > WATER_LEVEL && obstacles.length < 16) obstacles.push(new THREE.Vector4(x, z, r * 1.3, range(0, 6.28)));
  }
  for (let i = 0; i < 205; i++) {
    const z = range(-4.5, 4.5), x = riverX(z) + range(-1.62, 1.62);
    if (!inside(x, z, .98)) continue;
    const r = range(.027, .12);
    dummy.position.set(x, groundHeight(x, z) + r * .38, z);
    dummy.scale.set(r * range(1.1, 1.7), r * .65, r);dummy.rotation.set(random(), random() * 6.28, random());dummy.updateMatrix();
    rockMesh.setMatrixAt(rockCount, dummy.matrix);
    rockColor.setHSL(range(.09, .16), range(.08, .24), range(.34, .66));rockMesh.setColorAt(rockCount++, rockColor);
  }
  // Embed 75's existing stepping-stone in the deeper bank rather than leaving it floating.
  const footing=mesh(rockGeometry(),stoneMaterial,[-1.63,.12,.48]);
  footing.scale.set(.79,.29,.60);
  rockMesh.count = rockCount;rockMesh.castShadow = rockMesh.receiveShadow = true;scene.add(rockMesh);

  // Long narrow curved blades grow in patches, with bare earth between them.
  const bladeVertices = [], bladeIndices = [], bladeColors = [];
  for (let i = 0; i <= 5; i++) {
    const t = i / 5, w = .037 * (1 - t) + .001;
    for (const side of [-1, 1]) {
      bladeVertices.push(side * w + t * t * .12, t * .56, t * t * .065);
      const c = new THREE.Color('#536c32').lerp(new THREE.Color('#afbc66'), t);
      bladeColors.push(c.r, c.g, c.b);
    }
    if (i < 5) {const a = i * 2;bladeIndices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);}
  }
  const blade = new THREE.BufferGeometry();blade.setAttribute('position', new THREE.Float32BufferAttribute(bladeVertices, 3));
  blade.setAttribute('color', new THREE.Float32BufferAttribute(bladeColors, 3));blade.setIndex(bladeIndices);blade.computeVertexNormals();
  const windVertex = `
      vec4 mvPosition=vec4(transformed,1.0);
      #ifdef USE_INSTANCING
        mvPosition=instanceMatrix*mvPosition;
      #endif
      vec3 rootWorld=(modelMatrix*instanceMatrix[3]).xyz;
      float tip=position.y*position.y;
      float sway=sin(uWindTime*(1.3+uWind*1.6)+rootWorld.x*1.7+rootWorld.z)*(.10+uWind*.16)
        +sin(uWindTime*5.3+rootWorld.z*3.1)*uFlutter*.05;
      float lean=uWind*(.20+.12*sin(rootWorld.x*.8-uWindTime*1.9));
      mvPosition.xz+=uWindDir*(sway+lean)*tip*LEAN_SCALE;
      mvPosition.y-=abs(lean)*tip*LEAN_SCALE*.35;
      mvPosition=modelViewMatrix*mvPosition;
      gl_Position=projectionMatrix*mvPosition;`;
  const grassMaterial = new THREE.MeshStandardMaterial({color: '#ffffff', vertexColors: true, side: THREE.DoubleSide, roughness: .95});
  grassMaterial.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, {uWindTime: {value: 0}}, weather);
    shader.vertexShader = 'uniform float uWindTime,uWind,uFlutter;uniform vec2 uWindDir;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', windVertex.replaceAll('LEAN_SCALE', '1.0'));
    grassMaterial.userData.shader = shader;
  };
  const grass = new THREE.InstancedMesh(blade, grassMaterial, 3300);let grassCount = 0;
  for (let patch = 0; patch < 220; patch++) {
    const x = range(-5.9, 5.9), z = range(-4.5, 4.5), y = groundHeight(x, z);
    if (!inside(x, z, .96) || y < .18 || Math.hypot(x + 2.68, z - 1.1) < .48) continue;
    const patchiness = Math.sin(x * 1.5 + Math.sin(z * 1.7)) * Math.cos(z * 1.3);
    if (patchiness < -.30 || (Math.abs(z - .8) < .19 && x < -2)) continue;
    const blades = Math.floor(range(12, 29));
    for (let i = 0; i < blades && grassCount < 3300; i++) {
      const px = x + range(-.30, .30), pz = z + range(-.30, .30), py = groundHeight(px, pz);
      if (py < .14 || !inside(px, pz, .98)) continue;
      dummy.position.set(px, py - .016, pz);dummy.rotation.set(range(-.12, .12), range(0, 6.28), range(-.22, .22));
      dummy.scale.set(range(.6, 1.4), range(.45, 1.05) * (py < .25 ? 1.25 : 1), 1);dummy.updateMatrix();
      grass.setMatrixAt(grassCount, dummy.matrix);
      grass.setColorAt(grassCount++, new THREE.Color().setHSL(range(.19, .25), range(.10, .22), range(.73, .92)));
    }
  }
  grass.count = grassCount;grass.receiveShadow = true;scene.add(grass);

  // Sparse flowers and damp-bank reeds occur in local colonies.
  const stemMat = new THREE.MeshStandardMaterial({color: '#526d38', roughness: 1});
  const petalMat = new THREE.MeshStandardMaterial({color: '#f1ebcf', roughness: 1, side: THREE.DoubleSide});
  for (const [cx, cz] of [[-4, 1.8], [-3.6, -1.6], [3.7, 2.0]]) for (let n = 0; n < 7; n++) {
    const x = cx + range(-.5, .5), z = cz + range(-.5, .5), y = groundHeight(x, z), h = range(.18, .33);
    rod([x, y, z], [x + .015, y + h, z], .006, stemMat);
    const flower = mesh(new THREE.CircleGeometry(.045, 5), petalMat, [x + .015, y + h, z]);
    flower.rotation.x = -Math.PI / 2;flower.castShadow = false;
  }

  const leafMaterials = [];
  function tree(x, z, height, phase) {
    const group = new THREE.Group();group.position.set(x, groundHeight(x, z), z);scene.add(group);
    const fork = [[0, 0, 0], [.08, height * .6, 0], [-.12, height, .05]];
    rod(fork[0], fork[1], .11, barkMaterial, group, .075);
    rod(fork[1], fork[2], .075, barkMaterial, group, .035);
    const centers = [[-.60, height * .87, .05], [.45, height * 1.04, -.1], [.05, height * 1.23, .15]];
    centers.forEach(c => rod(fork[1], c, .045, barkMaterial, group, .013));
    const leafGeometry = new THREE.BufferGeometry();
    leafGeometry.setAttribute('position',new THREE.Float32BufferAttribute([
      0,.04,0,-.38,0,0,-.27,.025,.55,0,.065,1,
      .27,.025,.55,.38,0,0,.22,-.025,-.55,0,-.04,-1,-.22,-.025,-.55
    ],3));
    leafGeometry.setIndex([0,1,2,0,2,3,0,3,4,0,4,5,0,5,6,0,6,7,0,7,8,0,8,1]);
    leafGeometry.computeVertexNormals();
    const leafMat = new THREE.MeshStandardMaterial({color: '#ffffff', roughness: .97, side: THREE.DoubleSide});
    leafMat.onBeforeCompile = shader => {
      Object.assign(shader.uniforms, {uWindTime: {value: 0}}, weather);
      shader.vertexShader = 'uniform float uWindTime,uWind,uFlutter;uniform vec2 uWindDir;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', `
        vec4 mvPosition=vec4(transformed,1.0);
        mvPosition=instanceMatrix*mvPosition;
        vec3 leafWorld=instanceMatrix[3].xyz;
        float crown=smoothstep(.6,2.6,leafWorld.y);
        float flutter=sin(uWindTime*(6.0+uWind*5.0)+leafWorld.x*9.0+leafWorld.z*7.0)*(.012+uFlutter*.035);
        float lean=uWind*(.07+.05*sin(uWindTime*1.1+leafWorld.y*2.0))*crown;
        mvPosition.xz+=uWindDir*(lean+flutter);
        mvPosition.y+=flutter*.6;
        mvPosition=modelViewMatrix*mvPosition;
        gl_Position=projectionMatrix*mvPosition;`);
      leafMat.userData.shader = shader;
    };
    leafMaterials.push(leafMat);
    const leaves = new THREE.InstancedMesh(leafGeometry, leafMat, 800);
    for (let i = 0; i < 800; i++) {
      const c = centers[i % 3];let px, py, pz;
      do {px = range(-1, 1);py = range(-1, 1);pz = range(-1, 1);} while (px * px + py * py + pz * pz > 1);
      dummy.position.set(c[0] + px * .89, c[1] + py * .57, c[2] + pz * .73);
      dummy.scale.set(range(.19, .30), 1, range(.12, .21));
      dummy.rotation.set(range(-.8, .8), range(0, 6.28), range(-.6, .6));dummy.updateMatrix();leaves.setMatrixAt(i, dummy.matrix);
      leaves.setColorAt(i, new THREE.Color().setHSL(range(.23, .29), range(.36, .54), range(.29, .46)));
    }
    leaves.castShadow = leaves.receiveShadow = true;group.add(leaves);
    return {group, phase};
  }
  const trees = [tree(-4, -2.5, 2.05, .0), tree(3.8, -2.9, 2.35, 2), tree(5, -.5, 1.7, 4)];
  const fenceMat = naturalMaterial('#a28c64', 'bark');
  for (let i = 0; i < 5; i++) {const x = -5 + i * .58, y = groundHeight(x, -1.1);rod([x, y, -1.1], [x, y + .65, -1.1], .044, fenceMat);}
  rod([-5.05, 1.0, -1.1], [-2.65, 1.0, -1.1], .032, fenceMat);
  rod([-5.05, .74, -1.1], [-2.65, .74, -1.1], .027, fenceMat);

  // Flat, partly submerged rocks make a quiet cascade, not a wall across the whole creek.
  for (let i = 0; i < 8; i++) {
    const x = -.88 + i * .19, z = -3.89 + Math.sin(i) * .12;
    const o = mesh(rockGeometry(1), stoneMaterial, [x, .12, z]);o.scale.set(.30, .22, .29);
  }
  const falls = [];
  const foamMat = new THREE.MeshBasicMaterial({color: '#d7ede2', transparent: true, opacity: .56, depthWrite: false});
  for (let i = 0; i < 18; i++) {
    const x = range(-.94, .35), z = range(-3.93, -3.73);
    const o = rod([x, .30, z], [x + .025, WATER_LEVEL, z + .23], .007, foamMat);
    o.castShadow = false;falls.push(o);
  }

  // Capture the underlying scene once, then refract it through a depth-aware surface.
  const capture = new THREE.WebGLRenderTarget(1, 1, {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter});
  capture.depthTexture = new THREE.DepthTexture(1, 1, THREE.UnsignedIntType);
  capture.texture.colorSpace = THREE.LinearSRGBColorSpace;
  const waterUniforms = {
    uScene: {value: capture.texture}, uDepth: {value: capture.depthTexture},
    uTime: {value: 0}, uFlow: {value: .4}, uNear: {value: .1}, uFar: {value: 100},
    uResolution: {value: new THREE.Vector2(1, 1)}, uView: {value: new THREE.Matrix4()},
    uSunDirection: {value: new THREE.Vector3(-7, 11, 6).normalize()}, uSunStrength: {value: 1},
    uObstacleCount: {value: obstacles.length},
    uObstacles: {value: [...obstacles, ...Array.from({length: 16 - obstacles.length}, () => new THREE.Vector4())]},
    uShallow: {value: new THREE.Color('#75b8a5')}, uDeep: {value: new THREE.Color('#236d66')},
    uSky: {value: new THREE.Color('#b3d6d3')}, uRain: {value: 0}, uWind: weather.uWind, uWindDir: weather.uWindDir,
  };
  const waterMaterial = new THREE.ShaderMaterial({uniforms: waterUniforms, side: THREE.DoubleSide,
    vertexShader: `varying vec3 vWaterWorld;varying float vWaterViewDepth;
      void main(){vec4 world=modelMatrix*vec4(position,1.0);vWaterWorld=world.xyz;
        vec4 view=modelViewMatrix*vec4(position,1.0);vWaterViewDepth=-view.z;gl_Position=projectionMatrix*view;}`,
    fragmentShader: `
      #include <packing>
      uniform sampler2D uScene,uDepth;uniform float uTime,uFlow,uNear,uFar,uSunStrength;
      uniform vec2 uResolution;uniform mat4 uView;uniform vec3 uSunDirection,uShallow,uDeep,uSky;
      uniform int uObstacleCount;uniform vec4 uObstacles[16];uniform float uRain,uWind;uniform vec2 uWindDir;
      varying vec3 vWaterWorld;varying float vWaterViewDepth;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float wave(vec2 p){
        float t=uTime*(.35+uFlow*1.3);
        return sin(p.x*9.0+p.y*4.0-t*1.7)*.004
          +sin(p.x*15.0-p.y*7.0+t*1.1)*.0025+sin(p.y*22.0-t*2.4)*.0012;
      }
      // Raindrop rings: each cell of a jittered grid drops at its own random moment and rings outward.
      vec3 rainRings(vec2 p,float scale,float speed,float seed){
        vec2 g=p/scale,cell=floor(g);vec2 slope=vec2(0.0);float bright=0.0;
        for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){
          vec2 c=cell+vec2(float(i),float(j));
          float offset=hash(c+seed),cycle=uTime*speed+offset,life=fract(cycle),turn=floor(cycle);
          if(hash(c*1.37+turn*.73+seed)>uRain)continue;
          vec2 drop=c+vec2(hash(c+turn+3.1),hash(c+turn+7.7))*.8+.1;
          vec2 delta=g-drop;float d=length(delta),r=life*.95,x=d-r;
          float envelope=(1.0-life)*(1.0-life)*exp(-x*x*90.0);
          float ring=sin(x*42.0)*envelope;
          slope+=delta/max(d,.001)*ring;bright+=max(0.0,ring);
        }
        return vec3(slope,bright);
      }
      float thickness(vec2 uv){return max(0.0,-perspectiveDepthToViewZ(texture2D(uDepth,uv).x,uNear,uFar)-vWaterViewDepth);}
      void main(){
        vec2 uv=gl_FragCoord.xy/uResolution;
        vec2 p=vWaterWorld.xz;
        // Match the bank geometry exactly; no water rim around the cutaway plinth.
        float center=sin(p.y*.65)*.75;
        float channelWidth=1.66+sin(p.y*1.12+.7)*.15;
        float distance=abs(p.x-center)/channelWidth;
        float pool=-.49-.13*exp(-pow(p.y-.6,2.0)/2.2);
        float shelves=.065*sin(p.y*2.1+p.x*1.7);
        float bank=.48+.055*sin(p.x*1.8+p.y)*cos(p.y*1.3)+max(0.0,-p.y-2.3)*.12;
        float bed=mix(pool+shelves,bank,smoothstep(.62,1.50,distance));
        if(bed>.132)discard;
        float e=.025;
        vec3 normal=normalize(vec3((wave(p-vec2(e,0))-wave(p+vec2(e,0)))/(2.0*e),1.0,
          (wave(p-vec2(0,e))-wave(p+vec2(0,e)))/(2.0*e)));
        // Wind ruffles the surface in moving patches; rain adds rings on top.
        vec2 gustP=p*1.6-uWindDir*uTime*(.8+uWind*1.4);
        float windPatch=smoothstep(.35,.85,sin(gustP.x*1.3+sin(gustP.y*1.7))*.5+.5);
        float ruffle=uWind*windPatch;
        // Ripples finer than a pixel only shimmer, so they fade out when seen from far away.
        float footprint=length(fwidth(p));
        float detail=1.0-smoothstep(.012,.035,footprint);
        normal.xz+=vec2(sin(dot(p,uWindDir)*70.0-uTime*9.0),sin(p.x*53.0-p.y*61.0+uTime*7.0))*ruffle*.035*detail;
        vec3 rings=(rainRings(p,.30,.85,1.0)+rainRings(p+7.3,.19,1.15,9.0)*.7)*detail;
        normal.xz+=rings.xy*.09;
        float wake=0.0;
        for(int i=0;i<16;i++){
          if(i>=uObstacleCount)break;
          vec2 delta=p-uObstacles[i].xy;float r=uObstacles[i].z;
          float dist=length(delta),edge=dist-r;
          float upstream=smoothstep(-.1,.35,-delta.y);
          float ring=exp(-abs(edge)*20.0)*upstream;
          wake+=ring*(.30+.35*sin(dist*32.0-uTime*3.0+uObstacles[i].w));
          normal.xz+=delta/max(dist,.01)*ring*.045;
        }
        normal=normalize(normal);
        float depth=thickness(uv);
        vec3 viewNormal=mat3(uView)*normal;
        vec2 refractUV=clamp(uv+viewNormal.xy*.008*min(depth,1.0),vec2(.001),vec2(.999));
        // Keep foreground stones and boots from bleeding across the waterline.
        if(thickness(refractUV)<.015)refractUV=uv;
        vec3 below=texture2D(uScene,refractUV).rgb;
        vec3 absorption=exp(-vec3(1.25,.37,.30)*min(depth,2.2));
        vec3 waterColor=mix(uShallow,uDeep,smoothstep(.1,1.2,depth));
        vec3 transmitted=below*absorption+waterColor*(1.0-absorption)*.44;
        vec3 viewDir=normalize(cameraPosition-vWaterWorld);
        float fresnel=.025+.975*pow(1.0-max(dot(normal,viewDir),0.0),5.0);
        vec3 reflected=mix(vec3(.11,.19,.12),uSky,smoothstep(-.15,.7,reflect(-viewDir,normal).y));
        float glint=pow(max(dot(normal,normalize(uSunDirection+viewDir)),0.0),260.0);
        float micro=pow(max(0.0,sin(p.x*63.0+p.y*41.0+uTime)*sin(p.y*51.0-uTime)),14.0);
        vec3 result=mix(transmitted,reflected,clamp(fresnel,.025,.52));
        result+=vec3(1.0,.88,.60)*(glint*.65+micro*.045)*uSunStrength;
        result=mix(result,vec3(.67,.79,.69),clamp(wake*.28,0.0,.26));
        // Rings catch a thin line of sky; heavy rain also dulls the surface a little.
        result+=uSky*min(rings.z,1.2)*.075+uSky*ruffle*.03*detail;
        gl_FragColor=vec4(result,1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const waterGeometry = new THREE.CircleGeometry(1, 96);waterGeometry.rotateX(-Math.PI / 2);waterGeometry.scale(6.27, 1, 4.79);
  const water = mesh(waterGeometry, waterMaterial, [0, WATER_LEVEL, 0]);water.castShadow = false;water.renderOrder = 3;
  let captureWidth = 0, captureHeight = 0;
  const size = new THREE.Vector2();
  return {
    water,
    isWater(x, z) {return inside(x, z) && groundHeight(x, z) < WATER_LEVEL - .01;},
    update(time, flow) {
      waterUniforms.uTime.value = time;waterUniforms.uFlow.value = flow;
      animatedMaterials.forEach(m => {if (m.userData.shader) m.userData.shader.uniforms.uNatureTime.value = time;});
      if (grassMaterial.userData.shader) grassMaterial.userData.shader.uniforms.uWindTime.value = time;
      leafMaterials.forEach(m => {if (m.userData.shader) m.userData.shader.uniforms.uWindTime.value = time;});
      const wind = weather.uWind.value;
      trees.forEach(t => {
        t.group.rotation.z = Math.sin(time * .55 + t.phase) * (.005 + wind * .008) - WIND_DIRECTION.x * wind * .018;
        t.group.rotation.x = WIND_DIRECTION.y * wind * .018;
      });
      falls.forEach((o, i) => {o.scale.y = .90 + Math.sin(time * 5 + i) * .10;});
    },
    setSun(strength) {waterUniforms.uSunStrength.value = .45 + strength * .65;},
    setSky(color) {waterUniforms.uSky.value.copy(color);},
    // rain, wetness and wind are 0..1; flutter is the short gust component of the wind.
    setWeather({rain, wet, wind, flutter}) {
      waterUniforms.uRain.value = rain;weather.uWet.value = wet;weather.uWind.value = wind;weather.uFlutter.value = flutter;
      // Wet grass and leaves go a little deeper in colour.
      grassMaterial.color.setRGB(1 - .2 * wet, 1 - .16 * wet, 1 - .2 * wet);
      leafMaterials.forEach(m => m.color.setRGB(1 - .2 * wet, 1 - .15 * wet, 1 - .18 * wet));
    },
    hideInCapture(object) {captureHidden.push(object);},
    render(camera) {
      renderer.getDrawingBufferSize(size);
      const scale = innerWidth < 760 ? .65 : .85;
      const w = Math.max(1, Math.floor(size.x * scale)), h = Math.max(1, Math.floor(size.y * scale));
      if (w !== captureWidth || h !== captureHeight) {capture.setSize(w, h);captureWidth = w;captureHeight = h;}
      waterUniforms.uResolution.value.copy(size);waterUniforms.uView.value.copy(camera.matrixWorldInverse);
      waterUniforms.uNear.value = camera.near;waterUniforms.uFar.value = camera.far;
      const target = renderer.getRenderTarget(), shadowAuto = renderer.shadowMap.autoUpdate;
      water.visible = false;captureHidden.forEach(o => {o.userData.wasVisible = o.visible;o.visible = false;});
      try {
        renderer.setRenderTarget(capture);renderer.render(scene, camera);
        // Shadow maps from the scene capture are reused for the visible pass.
        renderer.shadowMap.autoUpdate = false;
        renderer.setRenderTarget(target);water.visible = true;captureHidden.forEach(o => {o.visible = o.userData.wasVisible;});renderer.render(scene, camera);
      } finally {water.visible = true;renderer.setRenderTarget(target);renderer.shadowMap.autoUpdate = shadowAuto;}
    },
  };
}
