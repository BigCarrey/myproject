import { teamMembers } from '../../data/team';

interface MemberCardProps {
  data: Record<string, unknown>;
}

export function MemberCard({ data }: MemberCardProps) {
  const member = teamMembers.find((m) => m.id === data.memberId);
  if (!member) return null;

  const achieveRate = Math.round((member.monthlyAchieved / member.monthlyTarget) * 100);

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white font-medium text-[15px]">
            {member.avatar}
          </div>
          <div className="text-white">
            <p className="font-semibold text-[15px]">{member.name}</p>
            <p className="text-[13px] text-white/80">{member.level}</p>
          </div>
        </div>
      </div>
      <div className="p-3">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-[#F8FAFC] rounded-xl p-2 text-center">
            <p className="text-[13px] text-[#475569]">月度达成</p>
            <p className={`text-lg font-bold ${achieveRate >= 80 ? 'text-[#10B981]' : 'text-[#3B82F6]'}`}>{achieveRate}%</p>
            <p className="text-[13px] text-[#475569]">
              {(member.monthlyAchieved / 10000).toFixed(1)}万/{(member.monthlyTarget / 10000).toFixed(0)}万
            </p>
          </div>
          <div className="bg-[#F8FAFC] rounded-xl p-2 text-center">
            <p className="text-[13px] text-[#475569]">周拜访量</p>
            <p className="text-lg font-bold text-[#3B82F6]">
              {member.weeklyVisits}<span className="text-[13px] text-[#475569]">/{member.weeklyTarget}</span>
            </p>
            <p className="text-[13px] text-text-secondary">
              完成率 {Math.round((member.weeklyVisits / member.weeklyTarget) * 100)}%
            </p>
          </div>
        </div>

        {member.issues && member.issues.length > 0 && (
          <div className="bg-[#FEF3C7] rounded-xl p-2">
            <p className="text-[13px] font-medium text-[#B45309] mb-1">⚠️ 问题诊断：</p>
            {member.issues.map((issue, i) => (
              <p key={i} className="text-[13px] text-[#92400E] ml-2">• {issue}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
