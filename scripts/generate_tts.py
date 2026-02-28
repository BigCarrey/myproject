#!/usr/bin/env python3
"""
预生成阿里云 CosyVoice TTS 音频文件（Python 版，使用官方 SDK）
用法: pip install dashscope && DASHSCOPE_API_KEY=sk-xxx python scripts/generate_tts.py
"""
import os
import json
import time
from pathlib import Path

try:
    import dashscope
    from dashscope.audio.tts_v2 import SpeechSynthesizer
except ImportError:
    print("请先安装: pip install dashscope")
    exit(1)

API_KEY = os.environ.get("DASHSCOPE_API_KEY")
MODEL = "cosyvoice-v3-flash"
VOICE_ASSISTANT = "longanwen_v3"
VOICE_NARRATOR = "longanzhi_v3"
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "public" / "audio"

TTS_ITEMS = [
    ("overview-narration", "欢迎体验\"万能营销助手\"。绩优小张，入职平安人寿十年，服务五百多位客户，是营业区的业绩标兵。她平时最大的痛点是——客户太多、时间不够用；客户信息分散、整理费时间；不常联系的客户想加强经营，却不知从何入手。万能营销助手按月、周、日三级节奏，为她提供持续的客户经营引导。下面用五个场景，带您快速体验。", VOICE_NARRATOR),
    ("scene1-narration", "场景一，每月初，AI自动盘点客户，推荐经营名单并提醒生日与生存金。", VOICE_NARRATOR),
    ("scene2-narration", "场景二，每周初，AI推送分层经营计划与行事历。", VOICE_NARRATOR),
    ("scene3-narration", "场景三，每天，AI推送当日经营提醒，支持一键问候与转发资讯。", VOICE_NARRATOR),
    ("scene4-narration", "场景四，每周末，AI生成周报，标出薄弱环节与需加强经营的客户。", VOICE_NARRATOR),
    ("scene5-narration", "场景五，每月末，AI生成月度复盘报告，标出亮点与需提升技能。", VOICE_NARRATOR),
    ("scene1-step0", "小张，已完成本月客户盘点。低温客户加强联系，中高温客户加强拜访促成。本月有生日和生存金提醒，请留意。", VOICE_ASSISTANT),
    ("scene1-step1", "好的，已为您添加李平安的拜访计划。", VOICE_ASSISTANT),
    ("scene2-step0", "小张，本周经营计划已整理好。低温客户日常问候，中高温客户邀约活动，高温客户面访促成。行事历已推送。", VOICE_ASSISTANT),
    ("scene3-step0", "小张早上好，今日建议经营5位客户，可一键问候或转发资讯。", VOICE_ASSISTANT),
    ("scene3-step1", "好的，已为刘大明发送问候消息。", VOICE_ASSISTANT),
    ("scene4-step0", "小张，本周工作总结已生成，标出薄弱环节和需加强经营的客户，建议加入下周计划。", VOICE_ASSISTANT),
    ("scene4-step1", "小张，相关客户已加入下周计划，会按时提醒您。加油！", VOICE_ASSISTANT),
    ("scene5-step0", "小张，本月复盘已生成，超额完成本月目标！需提升的技能已标出。", VOICE_ASSISTANT),
    ("default-select-scene", "小张，还需要什么帮助吗？请选择场景。", VOICE_ASSISTANT),
    ("default-choose-scene", "小张，请选择场景，我来帮您。", VOICE_ASSISTANT),
]


def main():
    if not API_KEY:
        print("请设置环境变量 DASHSCOPE_API_KEY")
        exit(1)

    dashscope.api_key = API_KEY
    dashscope.base_websocket_api_url = "wss://dashscope.aliyuncs.com/api-ws/v1/inference"

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = {}

    for i, (key, text, voice) in enumerate(TTS_ITEMS):
        filename = f"{key}.mp3"
        filepath = OUTPUT_DIR / filename
        if filepath.exists():
            manifest[key] = f"/audio/{filename}"
            print(f"[{i+1}/{len(TTS_ITEMS)}] 跳过（已存在） {filename}")
            continue
        print(f"[{i+1}/{len(TTS_ITEMS)}] 生成 {filename}...")
        for attempt in range(3):
            try:
                synthesizer = SpeechSynthesizer(model=MODEL, voice=voice)
                audio = synthesizer.call(text)
                filepath.write_bytes(audio)
                manifest[key] = f"/audio/{filename}"
                print(f"  完成 ({len(audio)/1024:.1f} KB)")
                break
            except Exception as e:
                print(f"  尝试 {attempt+1}/3 失败: {e}")
                if attempt < 2:
                    time.sleep(2)
                else:
                    print(f"  放弃")
                    exit(1)
        time.sleep(0.5)

    # 生成 manifest
    manifest_path = Path(__file__).resolve().parent.parent / "src" / "data" / "audio-manifest.ts"
    text_to_key = {t.replace("\n", " ").replace("  ", " ").strip(): k for k, t, _ in TTS_ITEMS}
    content = f'''/**
 * TTS 音频清单 - 由 scripts/generate_tts.py 自动生成
 */
export const AUDIO_MANIFEST: Record<string, string> = {json.dumps(manifest, indent=2)};

export const TEXT_TO_KEY: Record<string, string> = {{
{chr(10).join(f'  {json.dumps(k)}: {json.dumps(v)},' for k, v in text_to_key.items())}
}};
'''
    manifest_path.write_text(content, encoding="utf-8")
    print(f"\n已生成 {manifest_path}")
    print("完成。")


if __name__ == "__main__":
    main()
