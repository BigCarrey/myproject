import { useState } from 'react';

interface ActionItem {
  id: string;
  time: string;
  customer: string;
  action: string;
  actionType: 'call' | 'message' | 'visit' | 'send';
  urgency: 'high' | 'normal';
  hint?: string;
}

interface V2DailyActionCardProps {
  data: Record<string, unknown>;
}

const actionTypeConfig: Record<string, { icon: string; color: string; bg: string }> = {
  call: { icon: '📞', color: '#4F6BF6', bg: '#EEF2FF' },
  message: { icon: '💬', color: '#7C3AED', bg: '#F5F3FF' },
  visit: { icon: '🤝', color: '#10B981', bg: '#ECFDF5' },
  send: { icon: '📤', color: '#0EA5E9', bg: '#F0F9FF' },
};

export function V2DailyActionCard({ data }: V2DailyActionCardProps) {
  const actions = (data.actions as ActionItem[]) || [];
  const dateLabel = data.dateLabel as string | undefined;
  const summary = data.summary as string | undefined;

  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const doneCount = completed.size;
  const total = actions.length;

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] px-4 py-3">
        <h3 className="text-white font-semibold text-[15px]">🔔 今日经营提醒</h3>
        <p className="text-white/80 text-[12px] mt-0.5">{dateLabel || '每日主动提醒，一键完成'}</p>
      </div>

      {/* Progress bar */}
      <div className="px-3 py-2.5 bg-purple-50 border-b border-purple-100">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[12px] text-purple-700 font-medium">今日完成进度</span>
          <span className="text-[12px] font-bold text-purple-700">{doneCount}/{total}</span>
        </div>
        <div className="h-1.5 bg-purple-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] transition-all duration-500"
            style={{ width: total > 0 ? `${(doneCount / total) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="px-3 pt-2.5 pb-1">
          <div className="bg-[#FFF9E7] rounded-lg p-2.5 border-l-4 border-orange-300 flex gap-1.5">
            <span className="text-[12px] flex-shrink-0">💡</span>
            <p className="text-[12px] text-orange-800 leading-relaxed">{summary}</p>
          </div>
        </div>
      )}

      {/* Action list */}
      <div className="p-3 space-y-2">
        {actions.map((item) => {
          const cfg = actionTypeConfig[item.actionType] || actionTypeConfig.call;
          const done = completed.has(item.id);
          return (
            <div
              key={item.id}
              className={`border rounded-xl overflow-hidden transition-all duration-300 ${done ? 'border-green-200 opacity-60' : 'border-gray-100'}`}
            >
              <div className="flex items-start gap-3 px-3 py-2.5">
                {/* Icon */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[15px]"
                  style={{ background: cfg.bg }}
                >
                  {cfg.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-gray-800">{item.customer}</span>
                    {item.urgency === 'high' && (
                      <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full border border-red-200">紧急</span>
                    )}
                    <span className="text-[11px] text-gray-400 ml-auto">{item.time}</span>
                  </div>
                  <p className="text-[12px] text-gray-600 mt-0.5">{item.action}</p>
                  {item.hint && !done && (
                    <p className="text-[11px] text-indigo-500 mt-1">→ {item.hint}</p>
                  )}
                </div>
              </div>

              {/* One-click button */}
              <div className="px-3 pb-2.5 flex justify-end">
                <button
                  onClick={() => toggle(item.id)}
                  className={`text-[12px] px-3 py-1 rounded-full font-medium transition-all duration-300 ${
                    done
                      ? 'bg-green-100 text-green-600 border border-green-200'
                      : 'text-white border'
                  }`}
                  style={
                    done
                      ? undefined
                      : { background: `linear-gradient(135deg, ${cfg.color}dd, ${cfg.color})`, borderColor: cfg.color }
                  }
                >
                  {done ? '✓ 已完成' : '一键完成'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
