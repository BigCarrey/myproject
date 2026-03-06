import { teamMembers } from '../../data/team';

export function TeamDashboard() {
  const statusColors = {
    excellent: 'border-[#10B981] bg-[#F0FDF4]',
    good: 'border-[#3B82F6] bg-[#EFF6FF]',
    'needs-attention': 'border-[#D4AF37] bg-[#FEFCE8]',
  };

  const statusLabels = {
    excellent: '🌟 优秀',
    good: '👍 良好',
    'needs-attention': '⚠️ 需关注',
  };

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] px-4 py-2.5">
        <h3 className="text-white font-semibold text-[15px]">👥 团队成员业绩看板</h3>
      </div>
      <div className="p-2 space-y-2">
        {teamMembers.map((member) => {
          const achieveRate = Math.round((member.monthlyAchieved / member.monthlyTarget) * 100);
          const visitRate = Math.round((member.weeklyVisits / member.weeklyTarget) * 100);

          return (
            <div
              key={member.id}
              className={`border-l-4 rounded-xl p-2.5 ${statusColors[member.status]}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#3B82F6] text-[13px] font-medium">
                    {member.avatar}
                  </div>
                  <div>
                    <span className="text-[15px] font-medium text-[#0F172A]">{member.name}</span>
                    <span className="text-[13px] text-[#475569] ml-1">({member.level})</span>
                  </div>
                </div>
                <span className="text-[13px] text-[#475569]">{statusLabels[member.status]}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[13px] text-[#475569]">目标达成</p>
                  <p className={`text-[15px] font-bold ${achieveRate >= 80 ? 'text-[#10B981]' : 'text-[#6366F1]'}`}>
                    {achieveRate}%
                  </p>
                </div>
                <div>
                  <p className="text-[13px] text-[#475569]">周拜访量</p>
                  <p className={`text-[15px] font-bold ${visitRate >= 80 ? 'text-[#10B981]' : 'text-[#6366F1]'}`}>
                    {member.weeklyVisits}/{member.weeklyTarget}
                  </p>
                </div>
                <div>
                  <p className="text-[13px] text-[#475569]">转化率</p>
                  <p className="text-[15px] font-bold text-[#3B82F6]">
                    {Math.round(member.conversionRate * 100)}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
