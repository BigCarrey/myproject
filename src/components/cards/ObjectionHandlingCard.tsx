interface ObjectionHandlingCardProps {
  data: Record<string, unknown>;
}

interface Objection {
  concern: string;
  response: string;
  caseRef?: string;
}

export function ObjectionHandlingCard({ data }: ObjectionHandlingCardProps) {
  const customerName = data.customerName as string;
  const objections = data.objections as Objection[];

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] px-4 py-2.5">
        <h3 className="text-white font-semibold text-[15px]">💡 异议处理建议 - {customerName}</h3>
      </div>
      <div className="p-3 space-y-3">
        {objections.map((obj, i) => (
          <div key={i} className="space-y-2">
            {/* Concern */}
            <div className="bg-[#FEF2F2] rounded-xl p-2.5">
              <p className="text-[13px] font-medium text-[#DC2626] mb-1">⚠️ 常见疑虑</p>
              <p className="text-[13px] text-[#0F172A]">{obj.concern}</p>
            </div>
            {/* Response script */}
            <div className="bg-[#F0FDF4] rounded-xl p-2.5">
              <p className="text-[13px] font-medium text-[#10B981] mb-1">💬 应对话术</p>
              <p className="text-[13px] text-[#0F172A] leading-[1.6]">{obj.response}</p>
            </div>
            {/* Case reference */}
            {obj.caseRef && (
              <div className="bg-[#EFF6FF] rounded-xl p-2.5">
                <p className="text-[13px] font-medium text-[#3B82F6] mb-1">📖 案例参考</p>
                <p className="text-[13px] text-[#0F172A]">{obj.caseRef}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
