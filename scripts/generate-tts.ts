/**
 * 预生成阿里云 CosyVoice TTS 音频文件
 * 用法: DASHSCOPE_API_KEY=sk-xxx npx tsx scripts/generate-tts.ts
 */
import WebSocket from 'ws';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

const API_KEY = process.env.DASHSCOPE_API_KEY;
const WS_URL = 'wss://dashscope.aliyuncs.com/api-ws/v1/inference/';
const MODEL = 'cosyvoice-v3-flash';
const VOICE_ASSISTANT = 'longanwen_v3'; // 龙安温 - AI 助手
const VOICE_NARRATOR = 'longanzhi_v3';   // 龙安智 - 旁白

const OUTPUT_DIR = join(process.cwd(), 'public', 'audio');

interface TtsItem {
  key: string;
  text: string;
  voice: typeof VOICE_ASSISTANT | typeof VOICE_NARRATOR;
}

// 所有需要 TTS 的文本（与 scenarios.ts、OverviewPage、App.tsx 保持一致）
const TTS_ITEMS: TtsItem[] = [
  // 开篇旁白
  {
    key: 'overview-narration',
    text: '欢迎体验"万能营销助手"。绩优小张，入职平安人寿十年，服务五百多位客户，是营业区的业绩标兵。她平时最大的痛点是——客户太多、时间不够用；客户信息分散、整理费时间；不常联系的客户想加强经营，却不知从何入手。万能营销助手按月、周、日三级节奏，为她提供持续的客户经营引导。下面用五个场景，带您快速体验。',
    voice: VOICE_NARRATOR,
  },
  // 场景切换旁白
  { key: 'scene1-narration', text: '场景一，每月初，AI自动盘点客户，推荐经营名单并提醒生日与生存金。', voice: VOICE_NARRATOR },
  { key: 'scene2-narration', text: '场景二，每周初，AI推送分层经营计划与行事历。', voice: VOICE_NARRATOR },
  { key: 'scene3-narration', text: '场景三，每天，AI推送当日经营提醒，支持一键问候与转发资讯。', voice: VOICE_NARRATOR },
  { key: 'scene4-narration', text: '场景四，每周末，AI生成周报，标出薄弱环节与需加强经营的客户。', voice: VOICE_NARRATOR },
  { key: 'scene5-narration', text: '场景五，每月末，AI生成月度复盘报告，标出亮点与需提升技能。', voice: VOICE_NARRATOR },
  // 场景一
  { key: 'scene1-step0', text: '小张，已完成本月客户盘点。低温客户加强联系，中高温客户加强拜访促成。本月有生日和生存金提醒，请留意。', voice: VOICE_ASSISTANT },
  { key: 'scene1-step1', text: '好的，已为您添加李平安的拜访计划。', voice: VOICE_ASSISTANT },
  // 场景二
  { key: 'scene2-step0', text: '小张，本周经营计划已整理好。低温客户日常问候，中高温客户邀约活动，高温客户面访促成。行事历已推送。', voice: VOICE_ASSISTANT },
  // 场景三
  { key: 'scene3-step0', text: '小张早上好，今日建议经营5位客户，可一键问候或转发资讯。', voice: VOICE_ASSISTANT },
  { key: 'scene3-step1', text: '好的，已为刘大明发送问候消息。', voice: VOICE_ASSISTANT },
  // 场景四
  { key: 'scene4-step0', text: '小张，本周工作总结已生成，标出薄弱环节和需加强经营的客户，建议加入下周计划。', voice: VOICE_ASSISTANT },
  { key: 'scene4-step1', text: '小张，相关客户已加入下周计划，会按时提醒您。加油！', voice: VOICE_ASSISTANT },
  // 场景五
  { key: 'scene5-step0', text: '小张，本月复盘已生成，超额完成本月目标！需提升的技能已标出。', voice: VOICE_ASSISTANT },
  // useChat 默认回复
  { key: 'default-select-scene', text: '小张，还需要什么帮助吗？请选择场景。', voice: VOICE_ASSISTANT },
  { key: 'default-choose-scene', text: '小张，请选择场景，我来帮您。', voice: VOICE_ASSISTANT },
];

function synthesize(apiKey: string, text: string, voice: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const taskId = randomUUID();
    const audioChunks: Buffer[] = [];
    let textSent = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const ws = new WebSocket(WS_URL, {
      headers: {
        Authorization: `bearer ${apiKey}`,
      },
    });

    ws.on('open', () => {
      timeoutId = setTimeout(() => {
        ws.close();
        reject(new Error('TTS timeout (30s)'));
      }, 30000);
      if (process.env.DEBUG_TTS === '1') console.log('  [ws] connected');
      ws.send(
        JSON.stringify({
          header: { action: 'run-task', task_id: taskId, streaming: 'duplex' },
          payload: {
            task_group: 'audio',
            task: 'tts',
            function: 'SpeechSynthesizer',
            model: MODEL,
            parameters: {
              text_type: 'PlainText',
              voice,
              format: 'mp3',
              sample_rate: 22050,
              volume: 50,
              rate: 1,
              pitch: 1,
              enable_ssml: false,
            },
            input: {},
          },
        })
      );
    });

    const DEBUG = process.env.DEBUG_TTS === '1';
    ws.on('message', (data: WebSocket.Data) => {
      if (Buffer.isBuffer(data)) {
        audioChunks.push(data);
        return;
      }
      const raw = data.toString();
      if (DEBUG) console.log('  [ws] raw:', raw.slice(0, 300));
      const msg = JSON.parse(raw) as { header?: { event?: string; error_message?: string } };
      const event = msg?.header?.event;
      if (event === 'task-started') {
        if (!textSent) {
          textSent = true;
          ws.send(
            JSON.stringify({
              header: { action: 'continue-task', task_id: taskId, streaming: 'duplex' },
              payload: { input: { text } },
            })
          );
          ws.send(
            JSON.stringify({
              header: { action: 'finish-task', task_id: taskId, streaming: 'duplex' },
              payload: { input: {} },
            })
          );
        }
      } else if (event === 'task-finished') {
        if (timeoutId) clearTimeout(timeoutId);
        setImmediate(() => {
          ws.close();
          resolve(Buffer.concat(audioChunks));
        });
      } else if (event === 'task-failed') {
        if (timeoutId) clearTimeout(timeoutId);
        const errMsg = msg?.header?.error_message ?? 'Unknown error';
        ws.close();
        reject(new Error(errMsg));
      }
    });

    ws.on('error', (err) => {
      if (timeoutId) clearTimeout(timeoutId);
      console.error('  [ws] error:', err);
      reject(err);
    });
    ws.on('close', (code, reason) => {
      if (timeoutId) clearTimeout(timeoutId);
      if (code !== 1000 && code !== 1005 && audioChunks.length === 0) {
        reject(new Error(`WebSocket closed: ${code} ${reason?.toString()}`));
      }
    });
  });
}

async function main() {
  if (!API_KEY) {
    console.error('请设置环境变量 DASHSCOPE_API_KEY');
    process.exit(1);
  }

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const manifest: Record<string, string> = {};

  for (let i = 0; i < TTS_ITEMS.length; i++) {
    const item = TTS_ITEMS[i];
    const filename = `${item.key}.mp3`;
    const filepath = join(OUTPUT_DIR, filename);
    console.log(`[${i + 1}/${TTS_ITEMS.length}] 生成 ${filename}...`);
    try {
      const audio = await synthesize(API_KEY, item.text, item.voice);
      writeFileSync(filepath, audio);
      manifest[item.key] = `/audio/${filename}`;
      console.log(`  完成 (${(audio.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`  失败:`, err);
      process.exit(1);
    }
    // 避免请求过快
    await new Promise((r) => setTimeout(r, 300));
  }

  function normalizeForKey(s: string): string {
    return s.replace(/\s+/g, ' ').trim();
  }

  // 生成 manifest 文件
  const manifestPath = join(process.cwd(), 'src', 'data', 'audio-manifest.ts');
  const manifestContent = `/**
 * TTS 音频清单 - 由 scripts/generate-tts.ts 自动生成
 * 映射文本 key -> 音频路径
 */
export const AUDIO_MANIFEST: Record<string, string> = ${JSON.stringify(manifest, null, 2)};

/** 文本 -> key 映射，用于运行时查找 */
export const TEXT_TO_KEY: Record<string, string> = {
${TTS_ITEMS.map((i) => `  ${JSON.stringify(normalizeForKey(i.text))}: ${JSON.stringify(i.key)},`).join('\n')}
};
`;

  writeFileSync(manifestPath, manifestContent);
  console.log('\n已生成', manifestPath);
  console.log('完成。');
}

main();
