// Coordinates are in the approved 1086 × 1448 illustration, not CSS pixels.
const W = 1086;
const H = 1448;
const TAIL_START = 1125;
const EYES = [
  { x: 646, y: 274, rx: 31, ry: 30, angle: -0.22 },
  { x: 784, y: 237, rx: 30, ry: 29, angle: -0.22 },
];

class YayaPortrait {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.image = new Image();
    this.noTail = canvas.hasAttribute('data-yaya-still');
    this.eyeSpecs = canvas.dataset.yayaEyes ? JSON.parse(canvas.dataset.yayaEyes) : EYES;
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.visible = true;
    this.near = false;
    this.amplitude = 0;
    this.phase = 0;
    this.blinkStart = null;
    this.frame = null;
    this.timer = null;
    this.last = null;
    const region = canvas.closest('[data-yaya-region]') || canvas;
    region.addEventListener('pointerenter', e => {
      if (e.pointerType !== 'touch') this.setNear(true);
    });
    region.addEventListener('pointerleave', () => this.setNear(false));
    region.addEventListener('focusin', () => this.setNear(true));
    region.addEventListener('focusout', () => this.setNear(false));
    canvas.addEventListener('yaya:blink', () => this.blink());
    document.addEventListener('visibilitychange', () => this.sync());
    this.motion.addEventListener('change', () => this.sync());
    this.observer = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.sync();
    });
    this.observer.observe(canvas);
    this.image.onload = () => {
      this.width = this.noTail ? this.image.naturalWidth : W;
      this.height = this.noTail ? this.image.naturalHeight : H;
      canvas.width = this.width;
      canvas.height = this.height;
      this.eyes = this.eyeSpecs.map(eye => {
        const texture = document.createElement('canvas');
        texture.width = eye.rx * 2;
        texture.height = eye.ry * 2;
        const eyeCtx = texture.getContext('2d');
        eyeCtx.translate(eye.rx, eye.ry);
        eyeCtx.rotate(-eye.angle);
        eyeCtx.drawImage(this.image, -eye.x, -eye.y);
        return { ...eye, texture };
      });
      this.ready = true;
      this.draw(0);
      canvas.parentElement?.classList.add('is-ready');
      this.sync();
    };
    this.image.onerror = () => {
      const fallback = document.createElement('img');
      fallback.src = canvas.dataset.src;
      fallback.alt = canvas.getAttribute('aria-label') || '丫丫';
      fallback.style.cssText = 'width:100%;height:auto;display:block';
      canvas.replaceWith(fallback);
    };
    this.image.src = canvas.dataset.src;
  }

  get enabled() {
    return this.ready && this.visible && !document.hidden && !this.motion.matches;
  }

  setNear(near) {
    if (this.noTail) return;
    this.near = near;
    if (this.enabled) this.start();
  }

  sync() {
    clearTimeout(this.timer);
    this.timer = null;
    if (!this.enabled) {
      cancelAnimationFrame(this.frame);
      this.frame = null;
      this.last = null;
      this.blinkStart = null;
      this.amplitude = 0;
      if (this.ready) this.draw(0);
      return;
    }
    this.scheduleBlink();
    if (this.near) this.start();
  }

  scheduleBlink() {
    clearTimeout(this.timer);
    if (!this.enabled) return;
    this.timer = setTimeout(() => this.blink(), 4200 + Math.random() * 4800);
  }

  blink() {
    if (!this.enabled || this.blinkStart !== null) return;
    clearTimeout(this.timer);
    this.blinkStart = performance.now();
    this.start();
  }

  start() {
    if (this.frame !== null) return;
    this.last = performance.now();
    this.frame = requestAnimationFrame(t => this.tick(t));
  }

  tick(time) {
    this.frame = null;
    if (!this.enabled) return;
    const dt = Math.min((time - this.last) / 1000, 0.05);
    this.last = time;
    const target = this.near ? 1 : 0;
    this.amplitude += (target - this.amplitude) * (1 - Math.exp(-dt * 5));
    this.phase += dt * 2.1;
    let closure = 0;
    if (this.blinkStart !== null) {
      const elapsed = time - this.blinkStart;
      if (elapsed < 130) closure = Math.sin((elapsed / 130) * Math.PI / 2);
      else if (elapsed < 290) closure = Math.cos(((elapsed - 130) / 160) * Math.PI / 2);
      else {
        this.blinkStart = null;
        this.scheduleBlink();
      }
    }
    this.draw(closure);
    if (this.near || this.amplitude > 0.002 || this.blinkStart !== null) this.start();
    else {
      this.amplitude = 0;
      this.last = null;
      this.draw(0);
    }
  }

  draw(closure) {
    const ctx = this.ctx;
    const width = this.width || W;
    const height = this.height || H;
    ctx.clearRect(0, 0, width, height);
    if (this.noTail) {
      ctx.drawImage(this.image, 0, 0, width, height);
    } else {
      ctx.drawImage(this.image, 0, 0, W, TAIL_START, 0, 0, W, TAIL_START);
      // Displacement starts at zero, preserving the join and keeping the body still.
      for (let y = TAIL_START; y < H; y += 2) {
        const stripHeight = Math.min(2, H - y);
        const progress = (y - TAIL_START) / (H - TAIL_START);
        const offset = Math.sin(this.phase) * 72 * progress * progress * this.amplitude;
        ctx.drawImage(this.image, 0, y, W, stripHeight, offset, y, W, stripHeight);
      }
    }
    if (closure < 0.005) return;
    for (const eye of this.eyes) this.drawEye(eye, closure);
  }

  drawEye(eye, closure) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(eye.x, eye.y);
    ctx.rotate(eye.angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, eye.rx, eye.ry, 0, 0, Math.PI * 2);
    ctx.clip();
    // Eyelids are dark because both eyes sit within the cat's black face patches.
    ctx.fillStyle = '#1d2225';
    ctx.fillRect(-eye.rx, -eye.ry, eye.rx * 2, eye.ry * 2);
    // Crop first: compressing the whole image would pull white chest pixels
    // into the eyelid seam and produce an unnatural bright stripe.
    ctx.save();
    ctx.scale(1, Math.max(0.025, 1 - closure));
    ctx.drawImage(eye.texture, -eye.rx, -eye.ry);
    ctx.restore();
    ctx.globalAlpha = closure;
    ctx.strokeStyle = '#41484b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-eye.rx + 5, 0);
    ctx.quadraticCurveTo(0, 5, eye.rx - 5, 0);
    ctx.stroke();
    ctx.restore();
  }
}

document.querySelectorAll('canvas[data-yaya]').forEach(canvas => new YayaPortrait(canvas));
