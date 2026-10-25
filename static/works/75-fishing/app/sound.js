// Rain, wind and the creek, all synthesized from noise so nothing has to load.
const SILENT_WAV = 'data:audio/wav;base64,UklGRkQDAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YSADAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==';

export class CreekSound {
  constructor() {this.context = null;this.on = false;this.level = {rain: 0, wind: 0, flutter: 0, flow: 0};this.lastSet = 0;this.playing = true;}

  // iPhone 打开静音开关时会静音 Web Audio，但不会静音媒体播放。
  // iOS 17 起声明为播放类音频即可；更早的系统靠一段循环播放的静音 <audio> 进入同样的模式。
  keepAudible() {
    if (this.audible) return;
    this.audible = true;
    if (navigator.audioSession) {
      try {navigator.audioSession.type = 'playback';return;} catch { /* 退回静音音频。 */ }
    }
    // 只有 iPhone / iPad 需要；安卓不会因静音模式静音 Web Audio，循环媒体反而会出现播放通知。
    const apple = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (!apple) return;
    const silence = new Audio(SILENT_WAV);
    silence.loop = true;
    silence.play().catch(() => {this.audible = false;});
  }

  // Must run inside a tap or key press.
  start() {
    this.keepAudible();
    try {
      if (!this.context) this.build(new (window.AudioContext || window.webkitAudioContext)());
      if (this.context.state === 'suspended') this.context.resume();
    } catch {return false;}
    this.on = true;this.apply(true);
    return true;
  }
  stop() {this.on = false;if (this.context) this.apply(true);}

  noise(seconds, brown) {
    const ctx = this.context, buffer = ctx.createBuffer(2, ctx.sampleRate * seconds, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = buffer.getChannelData(c);let last = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        if (brown) {last = (last + .02 * white) / 1.02;data[i] = last * 3.5;} else data[i] = white;
      }
    }
    return buffer;
  }
  loop(buffer, ...chain) {
    const source = this.context.createBufferSource();source.buffer = buffer;source.loop = true;
    source.loopStart = 0;source.start(0, Math.random() * buffer.duration);
    chain.reduce((from, to) => {from.connect(to);return to;}, source);
    return source;
  }
  filter(type, frequency, Q = .7) {
    const f = this.context.createBiquadFilter();f.type = type;f.frequency.value = frequency;f.Q.value = Q;return f;
  }
  gain(value = 0) {const g = this.context.createGain();g.gain.value = value;return g;}

  build(ctx) {
    this.context = ctx;
    this.master = this.gain(0);
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -20;compressor.knee.value = 20;compressor.ratio.value = 3;
    this.master.connect(compressor);compressor.connect(ctx.destination);
    const white = this.noise(4, false), brown = this.noise(6, true);
    // A soft, wide hiss for rain far away, and a brighter layer for rain close by.
    this.rainFar = this.gain();this.loop(white, this.filter('lowpass', 1800), this.filter('highpass', 280), this.rainFar, this.master);
    this.rainNear = this.gain();this.loop(white, this.filter('highpass', 2600), this.filter('lowpass', 9000), this.rainNear, this.master);
    // Wind: a slow roar whose band rises with each gust, a faint whistle at the peaks, and the leaves.
    this.windBand = this.filter('bandpass', 380, .55);this.wind = this.gain();
    this.loop(brown, this.windBand, this.wind, this.master);
    this.whistleBand = this.filter('bandpass', 760, 14);this.whistle = this.gain();
    this.loop(white, this.whistleBand, this.whistle, this.master);
    this.leaves = this.gain();this.loop(white, this.filter('highpass', 3200), this.filter('lowpass', 7500), this.leaves, this.master);
    // The creek babbles through a few narrow bands that jump around.
    this.creek = this.gain();this.creek.connect(this.master);
    this.babble = [520, 900, 1400].map(frequency => {
      const band = this.filter('bandpass', frequency, 3.5);this.loop(white, band, this.creek);return band;
    });
    this.dropBuffers = [.012, .02, .035].map(length => {
      const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * length), ctx.sampleRate), data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / data.length * 6);
      return buffer;
    });
    this.nextDrop = ctx.currentTime;this.nextPlink = ctx.currentTime;this.nextBabble = ctx.currentTime;
    setInterval(() => this.schedule(), 60);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) ctx.suspend();else if (this.on) ctx.resume();
    });
  }

  // Individual drops on leaves and stones, the odd plink into the creek, and the creek's babble.
  schedule() {
    const ctx = this.context, until = ctx.currentTime + .18, {rain, flow} = this.level;
    if (!this.on || ctx.state !== 'running') {this.nextDrop = this.nextPlink = this.nextBabble = until;return;}
    while (rain > .02 && this.nextDrop < until) {
      this.drop(this.nextDrop, rain);
      this.nextDrop += -Math.log(1 - Math.random()) / (5 + rain * 55);
    }
    while (rain > .02 && this.nextPlink < until) {
      this.plink(this.nextPlink);
      this.nextPlink += -Math.log(1 - Math.random()) / (.6 + rain * 4);
    }
    while (this.nextBabble < until) {
      this.babble.forEach(band => band.frequency.setTargetAtTime(band.frequency.value * .6 + (380 + Math.random() * 1500) * .4, this.nextBabble, .04));
      this.nextBabble += .07 + Math.random() * .12 / (.4 + flow);
    }
    if (rain <= .02) this.nextDrop = this.nextPlink = until;
  }
  drop(at, rain) {
    const ctx = this.context, source = ctx.createBufferSource();
    source.buffer = this.dropBuffers[Math.floor(Math.random() * 3)];source.playbackRate.value = .7 + Math.random() * .8;
    const band = this.filter('bandpass', 1400 + Math.random() * 4200, 1.4), level = this.gain((.03 + Math.random() * .09) * (.5 + rain * .5));
    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    source.connect(band);band.connect(level);
    if (pan) {pan.pan.value = Math.random() * 1.6 - .8;level.connect(pan);pan.connect(this.master);} else level.connect(this.master);
    source.start(at);source.onended = () => {source.disconnect();band.disconnect();level.disconnect();pan?.disconnect();};
  }
  // A drop hitting water rings upward in pitch.
  plink(at) {
    const ctx = this.context, osc = ctx.createOscillator(), level = this.gain(0);
    const f = 900 + Math.random() * 1100;
    osc.type = 'sine';osc.frequency.setValueAtTime(f, at);osc.frequency.exponentialRampToValueAtTime(f * 1.7, at + .045);
    level.gain.setValueAtTime(0, at);level.gain.linearRampToValueAtTime(.018 + Math.random() * .025, at + .004);
    level.gain.exponentialRampToValueAtTime(.0001, at + .07);
    osc.connect(level);level.connect(this.master);osc.start(at);osc.stop(at + .08);
    osc.onended = () => {osc.disconnect();level.disconnect();};
  }

  // Called every frame; audio parameters glide toward the scene at most ten times a second.
  update(level, playing) {
    this.level = level;this.playing = playing;
    if (!this.context) return;
    const now = performance.now();
    if (now - this.lastSet < 100) return;
    this.lastSet = now;this.apply(false);
  }
  apply(immediate) {
    const ctx = this.context, t = ctx.currentTime, glide = immediate ? .6 : .25;
    const {rain, wind, flutter, flow} = this.level;
    const set = (param, value) => param.setTargetAtTime(value, t, glide);
    set(this.master.gain, this.on && this.playing ? .9 : 0);
    set(this.rainFar.gain, .30 * rain ** .8);
    set(this.rainNear.gain, .07 * rain ** 1.3);
    set(this.windBand.frequency, 260 + wind * 520 + flutter * 300);
    set(this.wind.gain, .55 * wind ** 1.4);
    set(this.whistleBand.frequency, 640 + flutter * 520);
    set(this.whistle.gain, .025 * flutter);
    set(this.leaves.gain, .035 * wind + .07 * flutter);
    set(this.creek.gain, .02 + flow * .09);
  }
}
