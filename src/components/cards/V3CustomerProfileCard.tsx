interface V3CustomerProfileCardProps {
  data: Record<string, unknown>;
}

export function V3CustomerProfileCard({ data }: V3CustomerProfileCardProps) {
  const name = data.name as string | undefined;
  const avatar = data.avatar as string | undefined;
  const ageRange = data.ageRange as string | undefined;
  const role = data.role as string | undefined;
  const tags = (data.tags as string[]) || [];
  const interests = (data.interests as string[]) || [];
  const insights = (data.insights as Array<{ label: string; value: string; icon: string }>) || [];
  const needsTitle = data.needsTitle as string | undefined;
  const needs = (data.needs as Array<{ label: string; level: 'primary' | 'secondary'; urgency?: number; desc: string }>) || [];
  const urgencyNote = data.urgencyNote as string | undefined;

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)' }} className="px-4 py-3">
        <h3 className="text-white font-semibold text-[15px]">👁️ 好友兴趣洞察 · 朋友圈扫描</h3>
        <p className="text-white/80 text-[12px] mt-0.5">AI 扫描公开动态，生成客户画像</p>
      </div>

      <div className="p-3 space-y-3">
        {/* Profile */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-[18px] flex-shrink-0">
            {avatar || name?.[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[16px] text-gray-800">{name}</span>
              {ageRange && <span className="text-[12px] text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{ageRange}</span>}
            </div>
            {role && <p className="text-[13px] text-gray-500 mt-0.5">{role}</p>}
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <span key={i} className="text-[12px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100 font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <div>
            <p className="text-[12px] text-gray-500 font-medium mb-1.5">兴趣爱好（来自朋友圈）</p>
            <div className="flex flex-wrap gap-1.5">
              {interests.map((interest, i) => (
                <span key={i} className="text-[12px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Insights grid */}
        {insights.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {insights.map((item, i) => (
              <div key={i} className="bg-[#F8F9FF] rounded-xl p-2.5 border border-indigo-50">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[14px]">{item.icon}</span>
                  <span className="text-[11px] text-gray-500">{item.label}</span>
                </div>
                <p className="text-[12px] font-semibold text-gray-800 leading-snug">{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Needs Analysis */}
        {needs.length > 0 && (
          <div className="border-t border-gray-100 pt-3">
            <p className="text-[13px] font-semibold text-gray-700 mb-2">
              {needsTitle || '🔍 个性需求解析'}
            </p>
            <div className="space-y-2">
              {needs.map((need, i) => (
                <div key={i} className={`rounded-xl p-2.5 border ${need.level === 'primary' ? 'bg-[#FFF9E7] border-orange-200' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${need.level === 'primary' ? 'bg-orange-400 text-white' : 'bg-gray-300 text-gray-600'}`}>
                      {need.level === 'primary' ? '核心' : '次要'}
                    </span>
                    <span className="text-[13px] font-semibold text-gray-800">{need.label}</span>
                    {need.urgency !== undefined && (
                      <span className="ml-auto flex gap-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <span key={s} className={`text-[12px] ${s <= need.urgency! ? 'text-orange-400' : 'text-gray-200'}`}>★</span>
                        ))}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-gray-600 leading-relaxed">{need.desc}</p>
                </div>
              ))}
            </div>
            {urgencyNote && (
              <div className="mt-2 bg-red-50 rounded-lg px-3 py-2 border border-red-100">
                <p className="text-[12px] text-red-700 leading-relaxed">⚠️ {urgencyNote}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
