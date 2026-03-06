interface PlanCardProps {
  data: Record<string, unknown>;
}

interface PlanItem {
  week: string;
  tasks: string[];
}

export function PlanCard({ data }: PlanCardProps) {
  const title = data.title as string;
  const items = data.items as PlanItem[];

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] px-4 py-3">
        <h3 className="text-white font-semibold text-[15px] flex items-center gap-2">
          📋 {title}
        </h3>
      </div>
      <div className="p-4 space-y-3">
        {items.map((item, index) => (
          <div key={index}>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] text-white text-[13px] flex items-center justify-center font-bold shadow-sm">
                {index + 1}
              </span>
              <span className="text-[15px] font-semibold text-[#0F172A]">{item.week}</span>
            </div>
            <ul className="ml-8 space-y-1">
              {item.tasks.map((task, i) => (
                <li key={i} className="text-[13px] text-[#475569] flex items-start gap-1.5">
                  <span className="text-[#3B82F6] mt-0.5">•</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
