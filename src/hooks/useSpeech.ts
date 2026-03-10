import { useState, useCallback, useRef, useEffect } from 'react';

interface UseSpeechReturn {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  speakMale: (text: string) => void;
  speakMale2: (text: string) => void;
  enqueueSpeak: (text: string) => void;
  narrate: (text: string, onEnd?: () => void) => void;
  stopSpeaking: () => void;
  supported: boolean;
}

function stripPunct(text: string): string {
  return text.replace(/[。！？，、；：…]/g, '');
}

const isIOS = (): boolean =>
  typeof navigator !== 'undefined' &&
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  !(window as any).MSStream;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSpeechRecognition = (): (new () => any) | null => {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
};

/**
 * Pick a male Chinese voice for person/client lines.
 * @param skip — number of matches to skip (0 = first male voice, 1 = second male voice)
 * Works with both English voice names (Yunxi) and Chinese localized names (云希).
 * On Edge, non-local voices are Azure Neural = high quality.
 */
export function pickMaleZhVoice(skip = 0): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const allZh = voices.filter((v) => v.lang.startsWith('zh'));
  const zhCN = allZh.filter((v) => v.lang.replace('_', '-').startsWith('zh-CN'));
  const zhVoices = zhCN.length > 0 ? zhCN : allZh;
  if (zhVoices.length === 0) return null;

  // Male voice keywords — English + Chinese localized names
  // Grouped in pairs: each pair = one voice identity (English name, Chinese name)
  const maleNames = ['Yunxi', '云希', 'Yunyang', '云扬', 'Yunjian', '云健', 'Yunfeng', '云枫', 'Yunhao', '云皓', 'Kangkang', '康康'];
  const qualityTags = ['Natural', 'Premium', 'Enhanced', 'Neural', '自然', '在线'];

  // Collect all distinct high-quality male voices found
  const found: SpeechSynthesisVoice[] = [];
  const seen = new Set<string>();

  // 1st pass: high-quality male voices
  for (const name of maleNames) {
    const match = zhVoices.find(
      (v) => v.name.includes(name) && !seen.has(v.name) && (qualityTags.some((t) => v.name.includes(t)) || !v.localService)
    );
    if (match) { found.push(match); seen.add(match.name); }
  }
  // 2nd pass: any known male voice name (including local)
  for (const name of maleNames) {
    const match = zhVoices.find((v) => v.name.includes(name) && !seen.has(v.name));
    if (match) { found.push(match); seen.add(match.name); }
  }

  if (found.length > skip) return found[skip];
  if (found.length > 0) return found[0];

  // Fallback: non-local voice that differs from the female pick
  const femaleVoice = pickBestZhVoice();
  const remote = zhVoices.find((v) => !v.localService && v !== femaleVoice);
  if (remote) return remote;

  return zhVoices.find((v) => v !== femaleVoice) ?? null;
}

/**
 * Pick the best female Chinese voice (for AI assistant lines).
 * Works with both English voice names (Xiaoxiao) and Chinese localized names (晓晓).
 */
function pickBestZhVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const allZh = voices.filter((v) => v.lang.startsWith('zh'));
  const zhCN = allZh.filter((v) => v.lang.replace('_', '-').startsWith('zh-CN'));
  const zhVoices = zhCN.length > 0 ? zhCN : allZh;
  if (zhVoices.length === 0) return null;

  // Female voice keywords — English + Chinese localized names (includes iOS voices)
  const femaleNames = ['Xiaoxiao', '晓晓', 'Xiaoyi', '晓伊', 'Xiaoxuan', '晓萱', 'Tingting', '婷婷', 'Sinji', '沁姿', 'Meijia', '美佳'];
  const qualityTags = ['Natural', 'Premium', 'Enhanced', 'Neural', '自然', '在线'];

  // 1st: high-quality female by name
  for (const name of femaleNames) {
    const premium = zhVoices.find(
      (v) => v.name.includes(name) && (qualityTags.some((t) => v.name.includes(t)) || !v.localService)
    );
    if (premium) return premium;
  }
  // 2nd: any known female name
  for (const name of femaleNames) {
    const match = zhVoices.find((v) => v.name.includes(name));
    if (match) return match;
  }
  // 3rd: first non-local (network) voice — on Edge these are always high quality
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
  // Chrome bug workaround: long utterances (>~15s) silently stop.
  // A periodic pause+resume keeps the engine alive.
  const keepAliveRef = useRef<number | null>(null);

  const SILENCE_TIMEOUT = 1000; // 1秒静默后自动发送

  const supported =
    !!getSpeechRecognition() &&
    typeof window !== 'undefined' &&
    typeof window.speechSynthesis !== 'undefined';

  // iOS Safari requires a user-gesture "unlock" before speechSynthesis will play.
  // Speak a silent empty utterance on first touch to satisfy the browser policy.
  useEffect(() => {
    if (!isIOS()) return;
    const unlock = () => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      const u = new SpeechSynthesisUtterance('');
      u.volume = 0;
      window.speechSynthesis.speak(u);
    };
    document.addEventListener('touchstart', unlock, { once: true });
    return () => document.removeEventListener('touchstart', unlock);
  }, []);

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

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

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

      // 设置女性语音，无论是本地还是网络语音
      if (voice && voice.lang.startsWith('zh')) {
        utterance.voice = voice;
      }

      if (idx === chunks.length - 1) {
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
      }

      window.speechSynthesis.speak(utterance);
    });
  }, []);

  /** Speak as 王芯经理 — uses zh-TW (台湾国语) female voice for differentiation. */
  const speakMale = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    // Pick a zh-TW voice: HsiaoChen/晓辰, HsiaoYu/晓雨, or any zh-TW
    const voices = window.speechSynthesis.getVoices();
    const twVoices = voices.filter((v) => {
      const lang = v.lang.replace('_', '-');
      return lang.startsWith('zh-TW') || lang.startsWith('zh-Hant');
    });
    const twOnline = twVoices.find((v) => !v.localService);
    const voice = twOnline ?? twVoices[0] ?? pickBestZhVoice();

    const chunks = splitIntoChunks(text);
    if (chunks.length === 0) return;

    setIsSpeaking(true);

    chunks.forEach((chunk, idx) => {
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = voice?.lang?.startsWith('zh') ? voice.lang : 'zh-TW';
      utterance.rate = 1.3;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      if (voice) {
        utterance.voice = voice;
      }

      if (idx === chunks.length - 1) {
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
      }

      window.speechSynthesis.speak(utterance);
    });
  }, []);

  /** Speak as 张宁经理 — zh-CN female voice with pitch=0.5, rate=1.3 to simulate male. */
  const speakMale2 = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const voice = pickBestZhVoice();

    const chunks = splitIntoChunks(text);
    if (chunks.length === 0) return;

    setIsSpeaking(true);

    chunks.forEach((chunk, idx) => {
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = 'zh-CN';
      utterance.rate = 1.3;
      utterance.pitch = 0.5;
      utterance.volume = 1.0;

      if (voice && voice.lang.startsWith('zh')) {
        utterance.voice = voice;
      }

      if (idx === chunks.length - 1) {
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
      }

      window.speechSynthesis.speak(utterance);
    });
  }, []);

  /** Queue speech WITHOUT cancelling ongoing utterances. */
  const enqueueSpeak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

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
      if (voice && voice.lang.startsWith('zh')) {
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
  }, []);

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
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      onEnd?.();
      return;
    }

    clearKeepAlive();
    window.speechSynthesis.cancel();
    narrateSessionRef.current += 1;
    const session = narrateSessionRef.current;

    // Clean text for TTS: strip markdown, emoji, replace em-dashes with commas
    const clean = text
      .replace(/[#*_~`|>]/g, '')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/——/g, '，')
      .trim();

    if (!clean) {
      onEnd?.();
      return;
    }

    // 使用女性声音作为讲解声音，与AI助手保持一致
    const voice = pickBestZhVoice();
    // Single utterance – lets the engine read the whole passage in one breath
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'zh-CN';
    utterance.rate = 1.15;  // brisk narration pace
    utterance.pitch = 1.0;  // 女性音调
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
      // Fire onEnd on error so the scenario starts even if speech is blocked
      if (narrateSessionRef.current === session) onEnd?.();
    };

    window.speechSynthesis.speak(utterance);

    // Chrome bug: long utterances (>~15s) silently stop.
    // Periodic pause+resume keeps the engine alive.
    // NOTE: skip on iOS — pause/resume permanently halts speech on iOS Safari.
    if (!isIOS()) {
      keepAliveRef.current = window.setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);
    }
  }, [clearKeepAlive]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      clearKeepAlive();
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [clearKeepAlive]);

  return {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    speakMale,
    speakMale2,
    enqueueSpeak,
    narrate,
    stopSpeaking,
    supported,
  };
}
