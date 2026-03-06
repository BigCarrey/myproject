interface ScriptRecommendCardProps {
  data: Record<string, unknown>;
}

export function ScriptRecommendCard({ data }: ScriptRecommendCardProps) {
  const script = (data.script as string) || '';

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="px-4 py-2.5 bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8]">
        <h3 className="text-white font-semibold text-[15px]">话术推荐</h3>
      </div>
      <div className="p-4">
        <p className="text-[14px] text-[#0F172A] leading-relaxed whitespace-pre-wrap">{script}</p>
        <button
          className="mt-3 w-full py-2.5 rounded-xl text-white font-medium text-[14px]"
          style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}
        >
          一键发送
        </button>
      </div>
    </div>
  );
}
