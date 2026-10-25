import * as THREE from 'three';

// Slow gusts plus a short flutter on top; the scene, the water and the sound all read the same numbers.
export function gust(time, strength) {
  const slow = .5 + .5 * (Math.sin(time * .21) * .55 + Math.sin(time * .53 + 1.1) * .30 + Math.sin(time * 1.31 + 2.3) * .15);
  const swell = slow ** 1.6;
  const wind = Math.min(1, strength * (.35 + .75 * swell));
  const flutter = strength * Math.max(0, swell - .4) * 1.6 * (.65 + .35 * Math.sin(time * 7.1));
  return {wind, flutter: Math.min(1, flutter)};
}

// Rain falls as short streaks over the whole view and splashes where it lands on the island.
export function createRain(scene, {groundHeight, isWater, waterLevel, windDirection, mobile}) {
  const drops = mobile ? 1400 : 2800, radius = 8.5, top = 9;
  const inside = (x, z) => (x / 6.3) ** 2 + (z / 4.8) ** 2 < 1;
  const surface = (x, z) => !inside(x, z) ? -1.43 : isWater(x, z) ? waterLevel : groundHeight(x, z);
  const head = new Float32Array(drops * 3), speed = new Float32Array(drops);
  const positions = new Float32Array(drops * 6), alpha = new Float32Array(drops * 2);
  function spawn(i, y) {
    const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * radius;
    head[i * 3] = Math.cos(a) * r;head[i * 3 + 1] = y;head[i * 3 + 2] = Math.sin(a) * r * .85;
    speed[i] = 10.5 + Math.random() * 4.5;
  }
  for (let i = 0; i < drops; i++) {
    spawn(i, -1.4 + Math.random() * (top + 1.4));
    alpha[i * 2] = .28 + Math.random() * .42;alpha[i * 2 + 1] = 0;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
  geometry.setAttribute('alpha', new THREE.BufferAttribute(alpha, 1));
  const streakMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: {uColor: {value: new THREE.Color('#f4f8f7')}, uOpacity: {value: 1}},
    vertexShader: `attribute float alpha;varying float vAlpha;
      void main(){vAlpha=alpha;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `uniform vec3 uColor;uniform float uOpacity;varying float vAlpha;
      void main(){gl_FragColor=vec4(uColor,vAlpha*uOpacity);}`,
  });
  const streaks = new THREE.LineSegments(geometry, streakMaterial);
  streaks.frustumCulled = false;streaks.renderOrder = 6;scene.add(streaks);

  // Each landing throws up a couple of tiny droplets that arc and fade.
  const sparks = mobile ? 500 : 900;
  const sparkPosition = new Float32Array(sparks * 3), sparkLife = new Float32Array(sparks), sparkVelocity = new Float32Array(sparks * 3);
  let nextSpark = 0;
  const sparkGeometry = new THREE.BufferGeometry();
  sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparkPosition, 3).setUsage(THREE.DynamicDrawUsage));
  sparkGeometry.setAttribute('life', new THREE.BufferAttribute(sparkLife, 1).setUsage(THREE.DynamicDrawUsage));
  const sparkMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: {uPixel: {value: 1}},
    vertexShader: `attribute float life;varying float vLife;uniform float uPixel;
      void main(){vLife=life;vec4 view=modelViewMatrix*vec4(position,1.0);
        gl_PointSize=life>0.0?clamp(26.0*uPixel/-view.z,1.0,4.0):0.0;gl_Position=projectionMatrix*view;}`,
    fragmentShader: `varying float vLife;
      void main(){if(vLife<=0.0)discard;float d=length(gl_PointCoord-.5);
        gl_FragColor=vec4(.93,.97,.96,smoothstep(.5,.2,d)*min(1.0,vLife*5.0)*.75);}`,
  });
  const splashes = new THREE.Points(sparkGeometry, sparkMaterial);
  splashes.frustumCulled = false;splashes.renderOrder = 6;scene.add(splashes);
  function splash(x, y, z, count, lift) {
    for (let n = 0; n < count; n++) {
      const i = nextSpark;nextSpark = (nextSpark + 1) % sparks;
      const a = Math.random() * Math.PI * 2, out = .25 + Math.random() * .45;
      sparkPosition.set([x, y + .01, z], i * 3);
      sparkVelocity.set([Math.cos(a) * out, lift * (.7 + Math.random() * .6), Math.sin(a) * out], i * 3);
      sparkLife[i] = .18 + Math.random() * .16;
    }
  }

  return {
    objects: [streaks, splashes],
    update(dt, rain, wind, pixelRatio) {
      const active = Math.round(drops * Math.min(1, rain * 1.15) ** 1.2);
      geometry.setDrawRange(0, active * 2);
      streaks.visible = splashes.visible = rain > .01;
      streakMaterial.uniforms.uOpacity.value = .55 + rain * .45;
      sparkMaterial.uniforms.uPixel.value = pixelRatio;
      const vx = windDirection.x * wind * 5.5, vz = windDirection.y * wind * 5.5;
      // Light rain reads as short, faint dashes; heavier rain as longer streaks.
      const trail = .026 + rain * .02;
      for (let i = 0; i < active; i++) {
        const k = i * 3, vy = speed[i];
        head[k] += vx * dt;head[k + 1] -= vy * dt;head[k + 2] += vz * dt;
        const x = head[k], y = head[k + 1], z = head[k + 2];
        const ground = surface(x, z);
        if (y < ground) {
          if (ground > -1 && Math.random() < (mobile ? .35 : .6)) splash(x, ground, z, ground === waterLevel ? 1 : 2, ground === waterLevel ? .9 : 1.25);
          spawn(i, top + Math.random() * 1.5);
          // Start upwind so a steady wind still covers the island evenly.
          const fall = (top - ground) / speed[i];
          head[k] -= vx * fall;head[k + 2] -= vz * fall;
          continue;
        }
        positions[i * 6] = x;positions[i * 6 + 1] = y;positions[i * 6 + 2] = z;
        positions[i * 6 + 3] = x - vx * trail;positions[i * 6 + 4] = y + vy * trail;positions[i * 6 + 5] = z - vz * trail;
      }
      geometry.attributes.position.needsUpdate = true;
      for (let i = 0; i < sparks; i++) {
        if (sparkLife[i] <= 0) continue;
        sparkLife[i] -= dt;
        sparkVelocity[i * 3 + 1] -= 9 * dt;
        sparkPosition[i * 3] += sparkVelocity[i * 3] * dt;
        sparkPosition[i * 3 + 1] += sparkVelocity[i * 3 + 1] * dt;
        sparkPosition[i * 3 + 2] += sparkVelocity[i * 3 + 2] * dt;
      }
      sparkGeometry.attributes.position.needsUpdate = true;sparkGeometry.attributes.life.needsUpdate = true;
    },
  };
}
