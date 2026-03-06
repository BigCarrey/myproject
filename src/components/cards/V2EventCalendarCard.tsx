interface CalendarEvent {
  date: string;
  weekday: string;
  customer: string;
  eventType: string;
  eventDesc: string;
  action: string;
  actionType: 'visit' | 'call' | 'message' | 'gift';
  priority: 'high' | 'medium' | 'low';
}

interface V2EventCalendarCardProps {
  data: Record<string, unknown>;
}

const actionIcons: Record<string, string> = {
  visit: '🤝',
  call: '📞',
  message: '💬',
  gift: '🎁',
};

const actionColors: Record<string, string> = {
  visit: 'bg-purple-100 text-purple-700 border-purple-200',
  call: 'bg-blue-100 text-blue-700 border-blue-200',
  message: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  gift: 'bg-pink-100 text-pink-700 border-pink-200',
};

const eventTypeIcons: Record<string, string> = {
  '生日': '🎂',
  '保单周年': '📋',
  '节假日': '🎉',
  '子女升学': '🎓',
  '市场时机': '📈',
  '保单到期': '⏰',
};

const priorityDot: Record<string, string> = {
  high: 'bg-red-400',
  medium: 'bg-yellow-400',
  low: 'bg-gray-300',
};

export function V2EventCalendarCard({ data }: V2EventCalendarCardProps) {
  const events = (data.events as CalendarEvent[]) || [];
  const title = data.title as string | undefined;
  const triggerCount = data.triggerCount as number | undefined;

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6366F1] to-[#4F6BF6] px-4 py-3">
        <h3 className="text-white font-semibold text-[15px]">📅 {title || '经营计划排程'}</h3>
        {triggerCount !== undefined && (
          <p className="text-white/80 text-[12px] mt-0.5">已识别 {triggerCount} 个事件契机，自动编排行事历</p>
        )}
      </div>

      {/* Events list */}
      <div className="p-3 space-y-2.5">
        {events.map((evt, i) => (
          <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
            {/* Date row */}
            <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 border-b border-gray-100">
              <div className="flex-shrink-0 text-center">
                <div className="text-[18px] font-bold text-[#4F6BF6] leading-none">{evt.date.split('/')[1]}</div>
                <div className="text-[10px] text-gray-400">{evt.weekday}</div>
              </div>
              <div className="w-px h-8 bg-gray-200 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot[evt.priority]}`} />
                  <span className="text-[13px] font-semibold text-gray-800">{evt.customer}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[12px]">{eventTypeIcons[evt.eventType] || '📌'}</span>
                  <span className="text-[12px] text-gray-500">{evt.eventType}：{evt.eventDesc}</span>
                </div>
              </div>
            </div>
            {/* Action row */}
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-[12px] text-gray-600">{evt.action}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium flex items-center gap-1 ${actionColors[evt.actionType]}`}>
                {actionIcons[evt.actionType]} {evt.actionType === 'visit' ? '拜访' : evt.actionType === 'call' ? '电话' : evt.actionType === 'message' ? '发信息' : '送礼品'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
