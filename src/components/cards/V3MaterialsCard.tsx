interface Material {
  title: string;
  desc: string;
  icon: string;
  type: string;
}

interface V3MaterialsCardProps {
  data: Record<string, unknown>;
}

export function V3MaterialsCard({ data }: V3MaterialsCardProps) {
  const materials = (data.materials as Material[]) || [];
  const customerReply = data.customerReply as string | undefined;
  const followUpNote = data.followUpNote as string | undefined;

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }} className="px-4 py-3">
        <h3 className="text-white font-semibold text-[15px]">📄 讲解素材自动生成</h3>
        <p className="text-white/80 text-[12px] mt-0.5">AI 自动生成 4 份配套材料，一键全发给王哥</p>
      </div>

      <div className="p-3 space-y-3">
        {/* Materials list */}
        <div className="space-y-2">
          {materials.map((mat, i) => (
            <div key={i} className="flex gap-3 items-start bg-gray-50 rounded-xl p-2.5 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-[20px] flex-shrink-0">
                {mat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[13px] text-gray-800">{mat.title}</span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full border border-indigo-100">{mat.type}</span>
                </div>
                <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{mat.desc}</p>
              </div>
              <span className="text-green-500 text-[16px] flex-shrink-0 mt-0.5">✓</span>
            </div>
          ))}
        </div>

        {/* Send button */}
        <button
          className="w-full py-3 rounded-xl text-white font-semibold text-[14px] flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}
        >
          <span>📤</span>
          <span>一键全部发送给王哥</span>
        </button>

        {/* Customer reply */}
        {customerReply && (
          <div className="rounded-xl overflow-hidden border border-gray-100">
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-100">
              <p className="text-[11px] text-gray-400">📱 王哥回复</p>
            </div>
            <div className="flex gap-2 items-start px-3 py-2.5">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0 mt-0.5">
                王
              </div>
              <div className="bg-white rounded-[12px] rounded-tl-sm px-3 py-2 shadow-sm border border-gray-100">
                <p className="text-[13px] text-gray-800 leading-relaxed">{customerReply}</p>
              </div>
            </div>
          </div>
        )}

        {/* Follow-up reminder */}
        {followUpNote && (
          <div className="bg-[#FFF9E7] rounded-xl p-3 border border-amber-200 flex items-start gap-2">
            <span className="text-[18px] flex-shrink-0">🔔</span>
            <div>
              <p className="text-[13px] font-semibold text-amber-800">AI 跟进提醒</p>
              <p className="text-[12px] text-amber-700 mt-0.5 leading-relaxed">{followUpNote}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
