interface Material {
  type: 'article' | 'video' | 'product' | 'case' | 'tool';
  title: string;
  desc: string;
  matchReason: string;
  tag?: string;
}

interface V2MaterialKitCardProps {
  data: Record<string, unknown>;
}

const typeConfig: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  article: { icon: '📰', color: '#4F6BF6', bg: '#EEF2FF', label: '文章' },
  video: { icon: '🎬', color: '#7C3AED', bg: '#F5F3FF', label: '视频' },
  product: { icon: '📋', color: '#0EA5E9', bg: '#F0F9FF', label: '产品方案' },
  case: { icon: '💼', color: '#10B981', bg: '#ECFDF5', label: '案例' },
  tool: { icon: '🔧', color: '#F59E0B', bg: '#FFFBEB', label: '工具' },
};

export function V2MaterialKitCard({ data }: V2MaterialKitCardProps) {
  const customerName = data.customerName as string;
  const strategyNote = data.strategyNote as string | undefined;
  const materials = (data.materials as Material[]) || [];

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#818CF8] to-[#6366F1] px-4 py-3">
        <h3 className="text-white font-semibold text-[15px]">📂 {customerName} · 专属素材包</h3>
        {strategyNote && (
          <p className="text-white/80 text-[12px] mt-0.5">{strategyNote}</p>
        )}
      </div>

      {/* One-strategy banner */}
      <div className="px-3 py-2 bg-purple-50 border-b border-purple-100 flex items-center gap-2">
        <span className="text-[11px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium border border-purple-200">一客一策</span>
        <span className="text-[12px] text-purple-600">AI 根据客户画像智能匹配，共 {materials.length} 项素材</span>
      </div>

      {/* Materials */}
      <div className="p-3 space-y-2.5">
        {materials.map((mat, i) => {
          const cfg = typeConfig[mat.type] || typeConfig.article;
          return (
            <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="flex items-start gap-3 px-3 py-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[16px]"
                  style={{ background: cfg.bg }}
                >
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                    {mat.tag && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{mat.tag}</span>
                    )}
                  </div>
                  <p className="text-[13px] font-medium text-gray-800 mt-1">{mat.title}</p>
                  <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{mat.desc}</p>
                </div>
              </div>
              {/* Match reason */}
              <div className="mx-3 mb-2.5 bg-[#f0f4ff] rounded-lg px-2.5 py-2 flex items-start gap-1.5">
                <span className="text-[11px] flex-shrink-0 mt-0.5">🎯</span>
                <p className="text-[11px] text-[#4F6BF6] leading-relaxed">{mat.matchReason}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
