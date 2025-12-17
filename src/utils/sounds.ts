// Sound effects for the game

class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private enabled: boolean = true;
  private pendingCry: string | null = null;
  private hasInteracted: boolean = false;

  constructor() {
    // Initialize audio context on first user interaction (click or touch)
    const initOnInteraction = () => {
      this.initAudioContext();
      this.hasInteracted = true;

      // Play pending cry if any
      if (this.pendingCry) {
        this.playCry(this.pendingCry);
        this.pendingCry = null;
      }
    };

    document.addEventListener('click', initOnInteraction, { once: true });
    document.addEventListener('touchstart', initOnInteraction, { once: true });
    document.addEventListener('keydown', initOnInteraction, { once: true });
  }

  private initAudioContext(): void {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
  }

  /**
   * Plays a throw sound
   */
  playThrowSound(): void {
    if (!this.enabled) return;
    this.playTone([400, 300, 200], 0.05, 'square');
  }

  /**
   * Plays a button click sound
   */
  playClickSound(): void {
    if (!this.enabled) return;
    this.playTone([800], 0.03, 'square');
  }

  /**
   * Generates and plays tones
   */
  private playTone(
    frequencies: number[],
    duration: number,
    type: OscillatorType
  ): void {
    if (!this.audioContext) {
      this.initAudioContext();
    }

    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;

    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.type = type;
      oscillator.frequency.value = freq;

      gainNode.gain.setValueAtTime(0.1, now + index * duration);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + (index + 1) * duration);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.start(now + index * duration);
      oscillator.stop(now + (index + 1) * duration);
    });
  }

  /**
   * Toggle sound on/off
   */
  toggle(): boolean {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  /**
   * Check if sound is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Plays a Pokemon cry from an audio URL
   */
  async playCry(url: string): Promise<void> {
    if (!this.enabled || !url) return;

    // If user hasn't interacted yet, store the cry to play later
    if (!this.hasInteracted) {
      this.pendingCry = url;
      return;
    }

    try {
      const audio = new Audio(url);
      audio.volume = 0.3;
      await audio.play();
    } catch (error) {
      console.error('Error playing Pokemon cry:', error);
    }
  }

  /**
   * Plays an audio file from a URL
   */
  private async playAudioFile(url: string, volume: number = 0.3): Promise<void> {
    if (!this.enabled || !url) return;

    try {
      const audio = new Audio(url);
      audio.volume = volume;
      await audio.play();
    } catch (error) {
      console.error('Error playing audio file:', error);
    }
  }

  /**
   * Plays capture success sound
   */
  async playCaptureSuccessSound(): Promise<void> {
    await this.playAudioFile('./assets/scapture.ogg', 0.4);
  }

  /**
   * Plays capture fail sound
   */
  async playCaptureFailSound(): Promise<void> {
    await this.playAudioFile('./assets/sfail.ogg', 0.4);
  }

  /**
   * Plays shiny encounter sound
   */
  async playShinyEncounterSound(): Promise<void> {
    await this.playAudioFile('./assets/ssshiny.ogg', 0.4);
  }
}

export const soundManager = new SoundManager();
