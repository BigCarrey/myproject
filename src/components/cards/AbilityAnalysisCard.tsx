interface AbilityAnalysisCardProps {
  data: Record<string, unknown>;
}

interface MetricItem {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'danger';
}

interface SkillItem {
  label: string;
  level: 'strong' | 'weak';
}

export function AbilityAnalysisCard({ data }: AbilityAnalysisCardProps) {
  const memberName = data.memberName as string;
  const metrics = data.metrics as MetricItem[];
  const skills = data.skills as SkillItem[];

  const statusColor = {
    good: { text: 'text-[#10B981]', bg: 'bg-[#F0FDF4]', icon: '✅' },
    warning: { text: 'text-[#D4AF37]', bg: 'bg-[#FEFCE8]', icon: '⚠️' },
    danger: { text: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]', icon: '❗' },
  };

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] px-4 py-2.5">
        <h3 className="text-white font-semibold text-[15px]">📊 {memberName} - 画像与能力分析</h3>
      </div>
      <div className="p-3 space-y-3">
        {/* Metrics */}
        <div>
          <p className="text-[13px] font-medium text-[#475569] mb-2">目标完成情况</p>
          <div className="grid grid-cols-3 gap-2">
            {metrics.map((m, i) => {
              const s = statusColor[m.status];
              return (
                <div key={i} className={`${s.bg} rounded-xl p-2 text-center`}>
                  <p className="text-[12px] text-[#475569]">{m.label}</p>
                  <p className={`text-lg font-bold ${s.text}`}>{m.value}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skills */}
        <div>
          <p className="text-[13px] font-medium text-[#475569] mb-2">沟通表现分析</p>
          <div className="space-y-1.5">
            {skills.map((skill, i) => (
              <div
                key={i}
                className={`flex items-center justify-between rounded-xl px-3 py-1.5 ${
                  skill.level === 'strong' ? 'bg-[#F0FDF4]' : 'bg-[#FEF2F2]'
                }`}
              >
                <span className="text-[13px] text-[#0F172A]">{skill.label}</span>
                <span
                  className={`text-[12px] font-medium px-2 py-0.5 rounded-full ${
                    skill.level === 'strong'
                      ? 'bg-[#D1FAE5] text-[#059669]'
                      : 'bg-[#FECACA] text-[#DC2626]'
                  }`}
                >
                  {skill.level === 'strong' ? '较好' : '短板'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
