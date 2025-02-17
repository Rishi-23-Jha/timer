export class TimerAudio {
  private static instance: TimerAudio;
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];

  private constructor() { }

  static getInstance(): TimerAudio {
    if (!TimerAudio.instance) {
      TimerAudio.instance = new TimerAudio();
    }
    return TimerAudio.instance;
  }

  private async initializeAudioContext(): Promise<AudioContext> {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    return this.audioContext;
  }

  async play(options: {
    frequency?: number,
    duration?: number
  } = {}): Promise<void> {
    try {
      const audioContext = await this.initializeAudioContext();

      // Default parameters
      const freq = options.frequency || 880; // A5 note
      const duration = options.duration || 0.5;

      // Create oscillator and gain nodes
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Configure oscillator
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

      // Configure gain envelope for smooth sound
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Start and stop the oscillator
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);

      // Store references for potential multi-timer management
      this.oscillators.push(oscillator);
      this.gainNodes.push(gainNode);

      // Cleanup after sound ends
      setTimeout(() => this.cleanup(), duration * 1000);

    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  }

  stop(): void {
    this.cleanup();
  }

  private cleanup(): void {
    // Stop and disconnect all oscillators
    this.oscillators.forEach(oscillator => {
      try {
        oscillator.stop();
        oscillator.disconnect();
      } catch (error) {
        console.log('Error stopping oscillator:', error);
      }
    });

    // Disconnect gain nodes
    this.gainNodes.forEach(gainNode => {
      gainNode.disconnect();
    });

    // Reset arrays
    this.oscillators = [];
    this.gainNodes = [];
  }

  // Method to play different sounds for different events
  async playCompletionSound(): Promise<void> {
    await this.play({ frequency: 880, duration: 0.5 }); // A5 note
  }

  async playStartSound(): Promise<void> {
    await this.play({ frequency: 440, duration: 0.3 }); // A4 note
  }

  async playErrorSound(): Promise<void> {
    await this.play({ frequency: 220, duration: 0.4 }); // A3 note
  }
}

// Export a singleton instance for easy usage
export const timerAudio = TimerAudio.getInstance();