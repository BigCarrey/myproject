interface LearningPlanCardProps {
  data: Record<string, unknown>;
}

interface LearningItem {
  type: string;
  title: string;
}

const typeStyle: Record<string, { bg: string; text: string }> = {
  课程: { bg: 'bg-[#3B82F6]', text: 'text-white' },
  演练: { bg: 'bg-[#6366F1]', text: 'text-white' },
  工具: { bg: 'bg-[#10B981]', text: 'text-white' },
};

export function LearningPlanCard({ data }: LearningPlanCardProps) {
  const title = data.title as string;
  const items = data.items as LearningItem[];
  const tip = data.tip as string | undefined;

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] px-4 py-2.5">
        <h3 className="text-white font-semibold text-[15px]">📚 {title}</h3>
      </div>
      <div className="p-3 space-y-2">
        {items.map((item, i) => {
          const style = typeStyle[item.type] ?? { bg: 'bg-gray-400', text: 'text-white' };
          return (
            <div key={i} className="flex items-start gap-2 bg-[#F8FAFC] rounded-xl px-3 py-2.5">
              <span
                className={`text-[12px] font-medium ${style.bg} ${style.text} rounded px-1.5 py-0.5 flex-shrink-0 mt-0.5`}
              >
                {item.type}
              </span>
              <span className="text-[13px] text-[#0F172A] leading-[1.5]">{item.title}</span>
            </div>
          );
        })}
        {tip && (
          <div className="bg-[#EFF6FF] rounded-xl px-3 py-2 text-[12px] text-[#1E3A8A]">
            💡 {tip}
          </div>
        )}
      </div>
    </div>
  );
}
