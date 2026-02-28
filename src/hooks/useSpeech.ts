import { useState, useCallback, useRef } from 'react';
import { AUDIO_MANIFEST, TEXT_TO_KEY } from '../data/audio-manifest';

interface UseSpeechReturn {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  enqueueSpeak: (text: string) => void;
  narrate: (text: string, onEnd?: () => void) => void;
  stopSpeaking: () => void;
  supported: boolean;
}

function stripPunct(text: string): string {
  return text.replace(/[。！？，、；：…]/g, '');
}

/** 预生成音频播放倍速（1.0=原速，1.2=快 20%） */
const PREGENERATED_PLAYBACK_RATE = 1.2;

/** 将清单中的路径解析为带 base 的完整 URL（开发和生产均需 base 前缀） */
function resolveAudioUrl(path: string): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return path.startsWith('/') ? base + path : base + '/' + path;
}

/** 从预生成清单中查找音频 URL，找不到返回 null */
function findPreGeneratedAudio(text: string): string | null {
  const normalized = text
    .replace(/[#*_~`|>\-]/g, '')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
  const key = TEXT_TO_KEY[normalized];
  const path = key && AUDIO_MANIFEST[key] ? AUDIO_MANIFEST[key] : null;
  return path ? resolveAudioUrl(path) : null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSpeechRecognition = (): (new () => any) | null => {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
};

/**
 * Pick a male Chinese voice for narrator/旁白.
 * Prefers Azure neural male voices exposed by Chrome/Edge.
 * Falls back to any zh voice that is not the best female voice.
 */
function pickMaleZhVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  // Prefer Mandarin (zh-CN); only fall back to other zh variants if no CN voice exists
  const allZh = voices.filter((v) => v.lang.startsWith('zh'));
  const zhCN = allZh.filter((v) => v.lang.replace('_', '-').startsWith('zh-CN'));
  const zhVoices = zhCN.length > 0 ? zhCN : allZh;
  if (zhVoices.length === 0) return null;

  const maleNames = ['Yunxi', 'Yunyang', 'Yunjian', 'Yunfeng', 'Yunhao'];
  const qualityTags = ['Natural', 'Premium', 'Enhanced', 'Neural'];

  // 1st pass: Natural / Premium variant of a known male voice (best quality)
  for (const name of maleNames) {
    const premium = zhVoices.find(
      (v) => v.name.includes(name) && qualityTags.some((t) => v.name.includes(t))
    );
    if (premium) return premium;
  }
  // 2nd pass: any known male voice
  for (const name of maleNames) {
    const match = zhVoices.find((v) => v.name.includes(name));
    if (match) return match;
  }
  // 3rd pass: any non-local (network) voice that isn't the female pick
  const femaleVoice = pickBestZhVoice();
  const remote = zhVoices.find((v) => !v.localService && v !== femaleVoice);
  if (remote) return remote;

  return zhVoices.find((v) => v !== femaleVoice) ?? null;
}

/**
 * Pick the most natural-sounding Chinese voice available.
 * Prefer voices whose name contains keywords like "Natural", "Premium",
 * "Xiaoxiao", "Yunxi" (Azure neural voices that Chrome/Edge expose),
 * then fall back to any zh voice.
 */
function pickBestZhVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const allZh = voices.filter((v) => v.lang.startsWith('zh'));
  const zhCN = allZh.filter((v) => v.lang.replace('_', '-').startsWith('zh-CN'));
  const zhVoices = zhCN.length > 0 ? zhCN : allZh;
  if (zhVoices.length === 0) return null;

  // Rank by quality keywords (order matters – first match wins)
  const qualityKeywords = ['Natural', 'Premium', 'Enhanced', 'Neural', 'Xiaoxiao', 'Yunxi', 'Female'];
  for (const kw of qualityKeywords) {
    const match = zhVoices.find((v) => v.name.includes(kw));
    if (match) return match;
  }
  // Prefer non-local (network) voices – they tend to sound better
  const remote = zhVoices.find((v) => !v.localService);
  if (remote) return remote;

  return zhVoices[0];
}

/**
 * Clean and chunk text for speech synthesis.
 * Keeps chunks large enough to sound fluent while still allowing the
 * synthesiser to insert micro-pauses at natural boundaries.
 */
function splitIntoChunks(text: string): string[] {
  const clean = text
    .replace(/[#*_~`|>\-]/g, '')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .trim();

  // Split on major sentence boundaries only (。！？and newlines).
  // Semicolons and commas stay inside the chunk so the engine reads
  // them fluidly instead of inserting awkward pauses.
  const parts = clean.split(/(?<=[。！？\n])/);
  const trimmed = parts.map((s) => s.trim()).filter(Boolean);

  // Merge short fragments (< 8 chars) into the previous chunk so the
  // engine doesn't produce choppy micro-utterances.
  const merged: string[] = [];
  for (const seg of trimmed) {
    if (merged.length > 0 && seg.length < 8) {
      merged[merged.length - 1] += seg;
    } else {
      merged.push(seg);
    }
  }
  return merged;
}

export function useSpeech(): UseSpeechReturn {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<number | null>(null);
  // Session counter for narrate() – incremented on each call so a cancelled
  // narration never fires its onEnd callback.
  const narrateSessionRef = useRef(0);
  const keepAliveRef = useRef<number | null>(null);
  const audioQueueRef = useRef<Array<{ url: string; onEnd?: () => void }>>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const SILENCE_TIMEOUT = 1000; // 1秒静默后自动发送

  const supported =
    !!getSpeechRecognition() &&
    typeof window !== 'undefined' &&
    typeof window.speechSynthesis !== 'undefined';

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current !== null) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor) return;

    setTranscript('');

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'zh-CN';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const results = event.results;
      let text = '';
      for (let i = 0; i < results.length; i++) {
        const seg = results[i][0].transcript.trim();
        if (!seg) continue;
        text += stripPunct(seg);
      }
      setTranscript(text);

      // 每次收到新结果，重置静默计时器
      clearSilenceTimer();
      silenceTimerRef.current = window.setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, SILENCE_TIMEOUT);
    };

    recognition.onend = () => {
      clearSilenceTimer();
      setIsListening(false);
    };
    recognition.onerror = () => {
      clearSilenceTimer();
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [clearSilenceTimer]);

  const stopListening = useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [clearSilenceTimer]);

  const stopPreGeneratedAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    audioQueueRef.current = [];
  }, []);

  const processAudioQueue = useCallback(() => {
    const queue = audioQueueRef.current;
    if (queue.length === 0) {
      setIsSpeaking(false);
      return;
    }
    const { url, onEnd } = queue.shift()!;
    const audio = new Audio(url);
    audio.playbackRate = PREGENERATED_PLAYBACK_RATE;
    currentAudioRef.current = audio;
    audio.onended = () => {
      currentAudioRef.current = null;
      onEnd?.();
      processAudioQueue();
    };
    audio.onerror = () => {
      currentAudioRef.current = null;
      processAudioQueue();
    };
    audio.play().catch(() => processAudioQueue());
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined') return;

    stopPreGeneratedAudio();
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    const url = findPreGeneratedAudio(text);
    if (url) {
      setIsSpeaking(true);
      const audio = new Audio(url);
      audio.playbackRate = PREGENERATED_PLAYBACK_RATE;
      currentAudioRef.current = audio;
      audio.onended = () => {
        currentAudioRef.current = null;
        setIsSpeaking(false);
      };
      audio.onerror = () => {
        currentAudioRef.current = null;
        setIsSpeaking(false);
      };
      audio.play().catch(() => setIsSpeaking(false));
      return;
    }

    if (!window.speechSynthesis) return;
    const voice = pickBestZhVoice();
    const chunks = splitIntoChunks(text);
    if (chunks.length === 0) return;

    setIsSpeaking(true);
    chunks.forEach((chunk, idx) => {
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = 'zh-CN';
      utterance.rate = 1.25;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      if (voice && voice.lang.startsWith('zh') && voice.localService) {
        utterance.voice = voice;
      }
      if (idx === chunks.length - 1) {
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
      }
      window.speechSynthesis.speak(utterance);
    });
  }, [stopPreGeneratedAudio]);

  /** Queue speech WITHOUT cancelling ongoing utterances. */
  const enqueueSpeak = useCallback((text: string) => {
    if (typeof window === 'undefined') return;

    const url = findPreGeneratedAudio(text);
    if (url) {
      setIsSpeaking(true);
      audioQueueRef.current.push({ url });
      if (!currentAudioRef.current) processAudioQueue();
      return;
    }

    if (!window.speechSynthesis) return;
    const voice = pickBestZhVoice();
    const chunks = splitIntoChunks(text);
    if (chunks.length === 0) return;

    setIsSpeaking(true);
    chunks.forEach((chunk) => {
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = 'zh-CN';
      utterance.rate = 1.25;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      if (voice && voice.lang.startsWith('zh') && voice.localService) {
        utterance.voice = voice;
      }
      utterance.onend = () => {
        if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
          setIsSpeaking(false);
        }
      };
      utterance.onerror = () => {
        if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
          setIsSpeaking(false);
        }
      };
      window.speechSynthesis.speak(utterance);
    });
  }, [processAudioQueue]);

  /**
   * Male-voice narrator. Uses a SINGLE utterance (no chunking) so the TTS
   * engine handles prosody naturally without inter-chunk gaps that sound robotic.
   * onEnd fires only if this narration is NOT interrupted by a subsequent call.
   */
  const clearKeepAlive = useCallback(() => {
    if (keepAliveRef.current !== null) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  }, []);

  const narrate = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === 'undefined') {
      onEnd?.();
      return;
    }

    clearKeepAlive();
    stopPreGeneratedAudio();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    narrateSessionRef.current += 1;
    const session = narrateSessionRef.current;

    const url = findPreGeneratedAudio(text);
    if (url) {
      setIsSpeaking(true);
      const audio = new Audio(url);
      audio.playbackRate = PREGENERATED_PLAYBACK_RATE;
      currentAudioRef.current = audio;
      audio.onended = () => {
        currentAudioRef.current = null;
        setIsSpeaking(false);
        if (narrateSessionRef.current === session) onEnd?.();
      };
      audio.onerror = () => {
        currentAudioRef.current = null;
        setIsSpeaking(false);
        if (narrateSessionRef.current === session) onEnd?.();
      };
      audio.play().catch(() => {
        setIsSpeaking(false);
        if (narrateSessionRef.current === session) onEnd?.();
      });
      return;
    }

    if (!window.speechSynthesis) {
      onEnd?.();
      return;
    }

    const clean = text
      .replace(/[#*_~`|>]/g, '')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/——/g, '，')
      .trim();

    if (!clean) {
      onEnd?.();
      return;
    }

    const voice = pickMaleZhVoice();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'zh-CN';
    utterance.rate = 1.3;
    utterance.pitch = 0.9;
    utterance.volume = 1.0;
    if (voice) utterance.voice = voice;

    setIsSpeaking(true);
    utterance.onend = () => {
      clearKeepAlive();
      setIsSpeaking(false);
      if (narrateSessionRef.current === session) onEnd?.();
    };
    utterance.onerror = () => {
      clearKeepAlive();
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);

    keepAliveRef.current = window.setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  }, [clearKeepAlive, stopPreGeneratedAudio]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined') {
      clearKeepAlive();
      stopPreGeneratedAudio();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [clearKeepAlive, stopPreGeneratedAudio]);

  return {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    enqueueSpeak,
    narrate,
    stopSpeaking,
    supported,
  };
}
