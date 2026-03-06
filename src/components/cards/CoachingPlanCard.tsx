interface CoachingPlanCardProps {
  data: Record<string, unknown>;
}

interface TrainingItem {
  type: string;
  title: string;
}

export function CoachingPlanCard({ data }: CoachingPlanCardProps) {
  const memberName = data.memberName as string;
  const target = data.target as string;
  const targetDetail = data.targetDetail as string;
  const suggestion = data.suggestion as string;
  const trainings = data.trainings as TrainingItem[];

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] px-4 py-2.5">
        <h3 className="text-white font-semibold text-[15px]">📋 {memberName} - 面谈方案</h3>
      </div>
      <div className="p-3 space-y-2.5">
        {/* Target */}
        <div className="bg-[#EFF6FF] rounded-xl p-2.5">
          <p className="text-[13px] font-medium text-[#3B82F6] mb-1">🎯 当月目标</p>
          <p className="text-[15px] font-bold text-[#1E3A8A]">{target}</p>
          <p className="text-[12px] text-[#475569] mt-0.5">{targetDetail}</p>
        </div>

        {/* Suggestion */}
        <div className="bg-[#FEF3C7] rounded-xl p-2.5">
          <p className="text-[13px] font-medium text-[#D4AF37] mb-1">💡 提升建议</p>
          <p className="text-[13px] text-[#0F172A]">{suggestion}</p>
        </div>

        {/* Training */}
        <div className="bg-[#EFF6FF] rounded-xl p-2.5">
          <p className="text-[13px] font-medium text-[#3B82F6] mb-2">📚 提升训练</p>
          <div className="space-y-1.5">
            {trainings.map((t, i) => (
              <div key={i} className="flex items-start gap-2 crystal rounded-xl px-2.5 py-2">
                <span className="text-[12px] font-medium text-white bg-[#3B82F6] rounded px-1.5 py-0.5 flex-shrink-0">
                  {t.type}
                </span>
                <span className="text-[13px] text-[#0F172A]">{t.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
