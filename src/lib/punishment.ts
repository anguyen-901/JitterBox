// Shared AudioContext — created once, reused for all chirps
let sharedCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  sharedCtx ??= new AudioContext()
  return sharedCtx
}

function chirp(ctx: AudioContext, startTime: number): void {
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  const mainFilter = ctx.createBiquadFilter()

  oscillator.type = 'triangle'
  oscillator.frequency.setValueAtTime(3250, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(3150, startTime + 0.05);

  mainFilter.type = 'bandpass';
  mainFilter.frequency.value = 3200;
  mainFilter.Q.value = 2;

  const attack = 0.002;
  const decay = 0.08;

  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(0.8, startTime + attack);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + decay);

  oscillator.connect(mainFilter);
  mainFilter.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + decay + 0.01);
}

export function playSmokeDetectorChirp(): void {
  const ctx = getAudioContext()
  const now = ctx.currentTime
  chirp(ctx, now)
}
