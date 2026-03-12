interface ContentItem {
  icon: string;
  title: string;
  tag: string;
  desc: string;
}

interface Props {
  data: {
    contentItems: ContentItem[];
    forwardingScript: string;
  };
  onSend?: () => void;
}

export function FieldOutreachContentCard({ data, onSend }: Props) {
  const { contentItems, forwardingScript } = data;

  return (
    <div className="rounded-[20px] overflow-hidden shadow-sm border border-gray-100" style={{ background: '#fff' }}>
      {/* Header */}
      <div
        className="px-4 py-3"
        style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)' }}
      >
        <div className="text-white font-bold text-[14px]">📤 AI生成触客内容</div>
        <div className="text-white/75 text-[10px] mt-0.5">根据近期热点话题，AI为您定制以下触客内容，可一键转发</div>
      </div>

      {/* Content items */}
      <div className="px-3 pt-2.5 pb-1 flex flex-col gap-2">
        {contentItems.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-3 py-2 rounded-[12px]"
            style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
          >
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[18px] flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #E0F2FE, #EDE9FE)' }}
            >
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[12px] font-semibold text-[#1E293B]">{item.title}</span>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ color: '#0EA5E9', background: '#E0F2FE' }}
                >
                  {item.tag}
                </span>
              </div>
              <div className="text-[10px] text-[#64748B] truncate">{item.desc}</div>
            </div>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #0EA5E9, #6366F1)' }}
            >
              {i + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Forwarding script */}
      <div className="px-3 pb-3">
        <div className="text-[10px] text-[#64748B] font-medium mb-1.5 mt-1">📝 AI生成转发话术：</div>
        <div
          className="text-[11px] text-[#334155] leading-[1.55] rounded-[10px] px-3 py-2 mb-3"
          style={{ background: '#F1F5F9' }}
        >
          "{forwardingScript}"
        </div>
        <button
          onClick={onSend}
          className="w-full text-white font-bold text-[14px] rounded-[12px] py-3 transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #0EA5E9, #6366F1)', letterSpacing: '0.05em' }}
        >
          一键发送
        </button>
      </div>
    </div>
  );
}
