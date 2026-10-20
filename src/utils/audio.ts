/**
 * Web Audio API synthesizer for Vietnamese Women's Day 20/10
 * Plays an original I–vi–IV–V waltz in F with bell/music-box acoustics
 * plus subtle sparkling chime sound effects.
 */

class MusicBoxSynth {
  private ac: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: number | null = null;
  private nextTime = 0;
  private step = 0;
  private _isPlaying = false;

  private readonly BEAT = 60 / 84; // 84 bpm, 3/4 waltz
  private readonly EIGHTH = 60 / 84 / 2;

  // MIDI note to frequency
  private noteToFreq(midi: number): number {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // Chord roots + triads (F - Dm - Bb - C)
  private readonly CHORDS: [number, number[]][] = [
    [53, [65, 69, 72]], // F
    [50, [62, 65, 69]], // Dm
    [46, [58, 62, 65]], // Bb
    [48, [60, 64, 67]], // C
  ];

  // 16 bars of 3 beats each (0 = rest)
  private readonly MELODY: number[] = [
    77, 0, 76, 77, 81, 79, 77, 74, 0, 72, 74, 76,
    77, 0, 79, 81, 79, 77, 74, 77, 0, 76, 0, 0,
    81, 0, 79, 77, 76, 77, 74, 0, 77, 76, 74, 72,
    74, 77, 81, 84, 81, 77, 74, 76, 77, 79, 76, 72,
  ];

  private initContext() {
    if (this.ac) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ac = new AudioCtx();
    this.master = this.ac.createGain();
    this.master.gain.value = 0;

    // Soft warm stereo delay / reverb feedback
    const delay = this.ac.createDelay();
    const fb = this.ac.createGain();
    const wet = this.ac.createGain();

    delay.delayTime.value = 0.28;
    fb.gain.value = 0.3;
    wet.gain.value = 0.25;

    this.master.connect(this.ac.destination);
    this.master.connect(delay);
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(wet);
    wet.connect(this.ac.destination);
  }

  private bell(freq: number, t: number, vel: number, len = 1.8) {
    if (!this.ac || !this.master) return;
    const g = this.ac.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    g.connect(this.master);

    const partials: [number, number, OscillatorType][] = [
      [1, 1, 'sine'],
      [2, 0.35, 'sine'],
      [4.01, 0.12, 'triangle'],
    ];

    for (const [mul, amp, type] of partials) {
      const o = this.ac.createOscillator();
      const og = this.ac.createGain();
      o.type = type;
      o.frequency.value = freq * mul;
      og.gain.value = amp;
      o.connect(og);
      og.connect(g);
      o.start(t);
      o.stop(t + len + 0.05);
    }
  }

  private schedule = () => {
    if (!this.ac || !this._isPlaying) return;
    while (this.nextTime < this.ac.currentTime + 0.25) {
      const bar = Math.floor(this.step / 6);
      const inBar = this.step % 6;
      const [root, tri] = this.CHORDS[bar % 4];

      if (inBar === 0) {
        this.bell(this.noteToFreq(root), this.nextTime, 0.22, 2.6);
      }

      const arp = [tri[0], tri[1], tri[2], tri[1] + 12, tri[2], tri[1]];
      this.bell(this.noteToFreq(arp[inBar]), this.nextTime, 0.07, 1.2);

      if (inBar % 2 === 0) {
        const m = this.MELODY[(bar % 16) * 3 + inBar / 2];
        if (m) this.bell(this.noteToFreq(m), this.nextTime, 0.16, 2.2);
      }

      this.nextTime += this.EIGHTH;
      this.step++;
    }
  };

  public get isPlaying(): boolean {
    return this._isPlaying;
  }

  public async play(): Promise<void> {
    this.initContext();
    if (!this.ac || !this.master) return;

    if (this.ac.state === 'suspended') {
      await this.ac.resume();
    }

    this._isPlaying = true;
    this.master.gain.cancelScheduledValues(this.ac.currentTime);
    this.master.gain.linearRampToValueAtTime(0.5, this.ac.currentTime + 1.2);
    this.nextTime = this.ac.currentTime + 0.1;

    if (this.timer) clearInterval(this.timer);
    this.timer = window.setInterval(this.schedule, 60);
    this.schedule();
  }

  public pause(): void {
    this._isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.ac && this.master) {
      this.master.gain.cancelScheduledValues(this.ac.currentTime);
      this.master.gain.setValueAtTime(this.master.gain.value, this.ac.currentTime);
      this.master.gain.linearRampToValueAtTime(0, this.ac.currentTime + 0.4);
    }
  }

  public playChime(): void {
    try {
      this.initContext();
      if (!this.ac) return;
      if (this.ac.state === 'suspended') {
        this.ac.resume();
      }
      const t = this.ac.currentTime;
      const notes = [72, 76, 79, 84]; // C chord chime
      notes.forEach((m, idx) => {
        this.bell(this.noteToFreq(m), t + idx * 0.08, 0.14, 1.5);
      });
    } catch {
      // AudioContext not ready yet
    }
  }
}

export const musicBox = new MusicBoxSynth();
