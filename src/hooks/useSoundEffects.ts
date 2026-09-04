// Web Audio API sound effects - no external files needed
const audioCtx = typeof window !== "undefined" ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

function ensureContext() {
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.3) {
  if (!audioCtx) return;
  ensureContext();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playNoise(duration: number, volume = 0.15) {
  if (!audioCtx) return;
  ensureContext();
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  source.connect(gain);
  gain.connect(audioCtx.destination);
  source.start();
}

// ---- Stadium ambience (looping filtered noise + gentle crowd swell) ----
let ambienceNodes: { source: AudioBufferSourceNode; gain: GainNode; lfo: OscillatorNode; lfoGain: GainNode } | null = null;

function buildCrowdBuffer(ctx: AudioContext) {
  const seconds = 4;
  const size = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < size; i++) {
    const white = Math.random() * 2 - 1;
    // brown-ish noise => warm crowd murmur
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buffer;
}

export const Ambience = {
  start(volume = 0.05) {
    if (!audioCtx || ambienceNodes) return;
    ensureContext();
    const source = audioCtx.createBufferSource();
    source.buffer = buildCrowdBuffer(audioCtx);
    source.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 500;
    filter.Q.value = 0.6;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, audioCtx.currentTime + 2);

    // slow swell so the crowd "breathes"
    const lfo = audioCtx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = volume * 0.5;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    source.start();
    lfo.start();
    ambienceNodes = { source, gain, lfo, lfoGain };
  },
  setIntensity(level: "calm" | "tense" | "roar") {
    if (!audioCtx || !ambienceNodes) return;
    const target = level === "roar" ? 0.14 : level === "tense" ? 0.09 : 0.05;
    ambienceNodes.gain.gain.cancelScheduledValues(audioCtx.currentTime);
    ambienceNodes.gain.gain.setTargetAtTime(target, audioCtx.currentTime, 0.6);
    ambienceNodes.lfoGain.gain.setTargetAtTime(target * 0.5, audioCtx.currentTime, 0.6);
  },
  stop() {
    if (!audioCtx || !ambienceNodes) return;
    const { source, gain, lfo } = ambienceNodes;
    gain.gain.cancelScheduledValues(audioCtx.currentTime);
    gain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.4);
    setTimeout(() => {
      try { source.stop(); lfo.stop(); } catch { /* already stopped */ }
    }, 1200);
    ambienceNodes = null;
  },
};

export const SFX = {
  bidConfirm: () => {
    // crisp two-note confirmation for a placed bid
    playTone(1046, 0.08, "triangle", 0.28);
    setTimeout(() => playTone(1568, 0.14, "triangle", 0.22), 70);
    setTimeout(() => playNoise(0.04, 0.06), 60);
  },
  crowdCheer: () => {
    playNoise(0.9, 0.12);
    setTimeout(() => playNoise(0.6, 0.08), 250);
  },

  bid: () => {
    playTone(880, 0.15, "square", 0.2);
    setTimeout(() => playTone(1100, 0.1, "square", 0.15), 80);
  },
  myBid: () => {
    playTone(660, 0.1, "sine", 0.25);
    setTimeout(() => playTone(880, 0.1, "sine", 0.25), 100);
    setTimeout(() => playTone(1100, 0.15, "sine", 0.2), 200);
  },
  sold: () => {
    // Gavel slam + fanfare
    playNoise(0.08, 0.4);
    setTimeout(() => playNoise(0.05, 0.3), 100);
    setTimeout(() => {
      playTone(523, 0.3, "triangle", 0.3);
      setTimeout(() => playTone(659, 0.3, "triangle", 0.3), 150);
      setTimeout(() => playTone(784, 0.5, "triangle", 0.35), 300);
    }, 200);
  },
  unsold: () => {
    playTone(400, 0.3, "sawtooth", 0.15);
    setTimeout(() => playTone(300, 0.4, "sawtooth", 0.1), 200);
  },
  timerTick: () => {
    playTone(1000, 0.05, "square", 0.1);
  },
  timerUrgent: () => {
    playTone(1200, 0.08, "square", 0.2);
  },
  goingOnce: () => {
    playTone(700, 0.2, "triangle", 0.25);
    setTimeout(() => playTone(700, 0.15, "triangle", 0.2), 250);
  },
  playerReveal: () => {
    playTone(440, 0.15, "sine", 0.2);
    setTimeout(() => playTone(554, 0.15, "sine", 0.2), 120);
    setTimeout(() => playTone(660, 0.2, "sine", 0.25), 240);
  },
  ready: () => {
    playTone(800, 0.1, "sine", 0.2);
    setTimeout(() => playTone(1200, 0.15, "sine", 0.2), 100);
  },
  join: () => {
    playTone(600, 0.15, "triangle", 0.2);
    setTimeout(() => playTone(900, 0.2, "triangle", 0.2), 150);
  },
  click: () => {
    playTone(1000, 0.05, "sine", 0.1);
  },
};
