interface ScheduleCardProps {
  data: Record<string, unknown>;
}

interface ScheduleDay {
  day: string;
  items: Array<{
    time: string;
    task: string;
    type: string;
  }>;
}

export function ScheduleCard({ data }: ScheduleCardProps) {
  const title = data.title as string;
  const days = data.days as ScheduleDay[];

  const typeIcons: Record<string, string> = {
    visit: '🚶',
    call: '📞',
    prepare: '📝',
    meeting: '🏢',
  };

  const typeColors: Record<string, string> = {
    visit: 'border-l-[#3B82F6] bg-[#EFF6FF]',
    call: 'border-l-[#6366F1] bg-[#EEF2FF]',
    prepare: 'border-l-[#10B981] bg-[#F0FDF4]',
    meeting: 'border-l-[#8B5CF6] bg-[#F5F3FF]',
  };

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] px-4 py-2.5">
        <h3 className="text-white font-semibold text-[15px]">📅 {title}</h3>
      </div>
      <div className="p-2 space-y-2">
        {days.map((day, index) => (
          <div key={index}>
            <p className="text-[13px] font-semibold text-[#0F172A] mb-1 px-1">{day.day}</p>
            <div className="space-y-1">
              {day.items.map((item, i) => (
                <div
                  key={i}
                  className={`border-l-4 rounded-r-xl px-3 py-1.5 flex items-center gap-2 ${typeColors[item.type] || 'border-l-[#94a3b8] bg-[#F8FAFC]'}`}
                >
                  <span className="text-[13px]">{typeIcons[item.type] || '📌'}</span>
                  <span className="text-[13px] font-medium text-[#475569] w-10">{item.time}</span>
                  <span className="text-[13px] text-[#0F172A] flex-1">{item.task}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
