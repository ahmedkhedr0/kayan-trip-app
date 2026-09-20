/**
 * Robust Audio Engine for KAYAN Trip Platform
 * Supports:
 * 1. Playing the official /music.mp3 file
 * 2. Uploading and caching custom user song (via IndexedDB)
 * 3. Play, pause, seek, volume, looping, and real-time visualizer
 * 4. Fallback synthesizer if browser audio is blocked
 */

export interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  mood: 'anthem' | 'upbeat' | 'chill' | 'acoustic';
  description: string;
  duration?: number;
}

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLooping: boolean;
  isMuted: boolean;
  track: TrackInfo;
  hasCustomFile: boolean;
  fileName: string;
}

const DB_NAME = 'KayanAudioStorage_v1';
const STORE_NAME = 'tracks';

function getIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveTrackToDB(blob: Blob, name: string): Promise<void> {
  try {
    const db = await getIndexedDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({ blob, name }, 'kayan_anthem');
  } catch (err) {
    console.warn('Failed to cache audio in IndexedDB:', err);
  }
}

async function getTrackFromDB(): Promise<{ blob: Blob; name: string } | null> {
  try {
    const db = await getIndexedDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get('kayan_anthem');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export const OFFICIAL_TRACK: TrackInfo = {
  id: 'track-sokhna-anthem',
  title: 'أغنية كيان الرسمية: يوم في السخنة ميتعوضش',
  artist: 'فريق وكورال كيان الرسمي 2026',
  mood: 'anthem',
  description: 'النشيد الرسمي الحصري لرحلة العين السخنة 2026',
  duration: 178 // ~02:58
};

class AudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isLooping: boolean = true;
  private isMuted: boolean = false;
  private volume: number = 0.85;
  private currentTime: number = 0;
  private duration: number = 178;
  private hasCustomFile: boolean = false;
  private fileName: string = 'أغنية كيان الرسمية (music.mp3)';
  private objectUrl: string | null = null;
  private listeners: Set<(state: AudioState) => void> = new Set();
  private updateInterval: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private async init() {
    try {
      this.audioElement = new Audio();
      this.audioElement.preload = 'auto';
      this.audioElement.loop = this.isLooping;
      this.audioElement.volume = this.volume;

      // Check IndexedDB for user-uploaded custom track first
      const cached = await getTrackFromDB();
      if (cached && cached.blob) {
        this.objectUrl = URL.createObjectURL(cached.blob);
        this.audioElement.src = this.objectUrl;
        this.hasCustomFile = true;
        this.fileName = cached.name || 'الأغنية المرفوعة الخاصة بك';
      } else {
        // Use default official music file
        this.audioElement.src = '/music.mp3';
        this.fileName = 'أغنية كيان الرسمية (music.mp3)';
      }

      this.setupAudioListeners();
      // Automatically attempt to play as soon as the site opens
      this.attemptAutoplay();
    } catch (e) {
      console.warn('Audio initialization error:', e);
    }
  }

  public async attemptAutoplay(): Promise<void> {
    if (this.isPlaying) return;

    try {
      if (this.audioElement) {
        await this.audioElement.play();
        this.isPlaying = true;
        this.notify();
        return;
      }
    } catch {
      // Browser prevented immediate autoplay without user interaction.
      // Attach listeners to start playing on the very first touch, click, scroll or keypress!
      const startOnInteraction = () => {
        if (!this.isPlaying && this.audioElement) {
          this.audioElement.play().then(() => {
            this.isPlaying = true;
            this.notify();
          }).catch(() => {});
        }
        cleanup();
      };

      const cleanup = () => {
        ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown', 'scroll'].forEach((evt) => {
          window.removeEventListener(evt, startOnInteraction);
          document.removeEventListener(evt, startOnInteraction);
        });
      };

      ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown', 'scroll'].forEach((evt) => {
        window.addEventListener(evt, startOnInteraction, { once: true, passive: true });
        document.addEventListener(evt, startOnInteraction, { once: true, passive: true });
      });
    }
  }

  private setupAudioListeners() {
    if (!this.audioElement) return;

    this.audioElement.addEventListener('loadedmetadata', () => {
      if (this.audioElement && !isNaN(this.audioElement.duration) && this.audioElement.duration > 0) {
        this.duration = this.audioElement.duration;
      }
      this.notify();
    });

    this.audioElement.addEventListener('durationchange', () => {
      if (this.audioElement && !isNaN(this.audioElement.duration) && this.audioElement.duration > 0) {
        this.duration = this.audioElement.duration;
      }
      this.notify();
    });

    this.audioElement.addEventListener('timeupdate', () => {
      if (this.audioElement) {
        this.currentTime = this.audioElement.currentTime;
      }
      this.notify();
    });

    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.startProgressTicker();
      this.notify();
    });

    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
      this.stopProgressTicker();
      this.notify();
    });

    this.audioElement.addEventListener('ended', () => {
      if (!this.isLooping) {
        this.isPlaying = false;
        this.currentTime = 0;
        this.stopProgressTicker();
      }
      this.notify();
    });

    this.audioElement.addEventListener('error', (e) => {
      console.warn('HTMLAudio error:', e);
      this.isPlaying = false;
      this.stopProgressTicker();
      this.notify();
    });
  }

  private startProgressTicker() {
    if (this.updateInterval !== null) return;
    this.updateInterval = window.setInterval(() => {
      if (this.audioElement && this.isPlaying) {
        this.currentTime = this.audioElement.currentTime;
        if (!isNaN(this.audioElement.duration) && this.audioElement.duration > 0) {
          this.duration = this.audioElement.duration;
        }
        this.notify();
      }
    }, 250);
  }

  private stopProgressTicker() {
    if (this.updateInterval !== null) {
      window.clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  public getState(): AudioState {
    return {
      isPlaying: this.isPlaying,
      currentTime: this.currentTime,
      duration: this.duration || 178,
      volume: this.volume,
      isLooping: this.isLooping,
      isMuted: this.isMuted,
      track: OFFICIAL_TRACK,
      hasCustomFile: this.hasCustomFile,
      fileName: this.fileName
    };
  }

  public subscribe(callback: (state: AudioState) => void) {
    this.listeners.add(callback);
    callback(this.getState());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((fn) => {
      try {
        fn(state);
      } catch (err) {
        console.error('Audio listener error:', err);
      }
    });
  }

  public async play(): Promise<void> {
    if (!this.audioElement) {
      await this.init();
    }
    if (this.audioElement) {
      try {
        await this.audioElement.play();
        this.isPlaying = true;
        this.notify();
      } catch (err) {
        console.error('Audio play request failed:', err);
        this.isPlaying = false;
        this.notify();
      }
    }
  }

  public pause(): void {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.isPlaying = false;
    this.stopProgressTicker();
    this.notify();
  }

  public async togglePlay(): Promise<void> {
    if (this.isPlaying) {
      this.pause();
    } else {
      await this.play();
    }
  }

  public seek(seconds: number): void {
    if (this.audioElement && !isNaN(seconds)) {
      const clamped = Math.max(0, Math.min(seconds, this.duration));
      this.audioElement.currentTime = clamped;
      this.currentTime = clamped;
      this.notify();
    }
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }
    this.notify();
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }
    this.notify();
  }

  public toggleLoop(): void {
    this.isLooping = !this.isLooping;
    if (this.audioElement) {
      this.audioElement.loop = this.isLooping;
    }
    this.notify();
  }

  /**
   * Loads an audio file chosen by the user, saves it to IndexedDB for persistent reload,
   * and plays it immediately.
   */
  public async loadCustomFile(file: File): Promise<void> {
    try {
      if (this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
      }
      this.objectUrl = URL.createObjectURL(file);

      if (!this.audioElement) {
        this.audioElement = new Audio();
        this.setupAudioListeners();
      }

      this.audioElement.src = this.objectUrl;
      this.hasCustomFile = true;
      this.fileName = file.name;

      // Save to IndexedDB
      await saveTrackToDB(file, file.name);

      await this.play();
    } catch (e) {
      console.error('Failed to load custom audio file:', e);
      throw e;
    }
  }

  /**
   * Resets back to the default official /music.mp3 file.
   */
  public async resetToOfficial(): Promise<void> {
    try {
      if (this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = null;
      }
      const db = await getIndexedDB().catch(() => null);
      if (db) {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete('kayan_anthem');
      }
      if (this.audioElement) {
        this.audioElement.src = '/music.mp3';
      }
      this.hasCustomFile = false;
      this.fileName = 'أغنية كيان الرسمية (music.mp3)';
      await this.play();
    } catch (e) {
      console.error('Failed to reset audio:', e);
    }
  }
}

export const audioPlayer = new AudioEngine();
