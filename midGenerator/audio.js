class AudioController {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.impulseResponseBuffer = this.createImpulseResponse(2, 2); // 2 seconds reverb
  }

  playFrequency(frequency, type = 'square') {
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    const gainNode = this.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 1);
  }

  calculateFrequency(note) {
    const baseFrequencies = {
      'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
      'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00,
      'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88
    };
    const match = note.match(/([A-G]#?)(\d)/);
    if (!match) {
      throw new Error('Invalid note format');
    }
    const [noteName, octave] = match.slice(1, 3);
    const baseNote = noteName + '4';
    const baseFrequency = baseFrequencies[baseNote];
    const octaveDifference = octave - 6;
    return baseFrequency * Math.pow(2, octaveDifference);
  }

  playSquareWave(note) {
    const frequency = this.calculateFrequency(note);
    this.playFrequency(frequency, 'square');
  }

  createImpulseResponse(duration, decay) {
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);
    const impulseL = impulse.getChannelData(0);
    const impulseR = impulse.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const n = length - i;
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decay);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decay);
    }

    return impulse;
  }

  playFrequencyWithReverb(frequency, type = 'square') {
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    const convolver = this.audioContext.createConvolver();
    convolver.buffer = this.impulseResponseBuffer;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0.9; // Adjust the dry/wet mix

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    gainNode.connect(convolver);
    convolver.connect(this.audioContext.destination);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.17);
  }

  playNoteWithReverb(note, type = 'square') {
    const frequency = this.calculateFrequency(note);
    this.playFrequencyWithReverb(frequency, type);
  }
}

export default AudioController;
