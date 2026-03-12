interface ContentItem {
  icon: string;
  title: string;
  tag: string;
  desc: string;
}

interface FieldOutreachScriptsCardProps {
  data: {
    totalCount: number;
    priorityContact: {
      name: string;
      script: string;
      reason: string;
    };
    contentItems?: ContentItem[];
    forwardingScript?: string;
    generalTemplate?: string;
    templateCount?: number;
  };
}

export default function FieldOutreachScriptsCard({ data }: FieldOutreachScriptsCardProps) {
  const contentItems: ContentItem[] = data.contentItems || [
    { icon: '📊', title: '市场动态周报', tag: '文章', desc: '近期A股波动分析与资产配置建议' },
    { icon: '💰', title: '资产配置指南', tag: 'PDF', desc: '震荡市下高净值客户保全策略' },
    { icon: '📈', title: '同类客户案例', tag: '案例', desc: '企业主多元化配置，年化稳健收益' },
    { icon: '🏆', title: '理财收益对比', tag: '报告', desc: '保险年金vs其他资产5年收益对比' },
  ];
  const forwardingScript = data.forwardingScript || '陈先生，我给您整理了几份资产配置的参考资料，包括市场分析、方案指南、客户案例等，抽空看看，有问题随时聊！';

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-sm border border-gray-100"
      style={{ background: '#fff' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-[14px] py-[12px]"
        style={{ background: 'linear-gradient(90deg, #1E40AF 0%, #3B82F6 100%)' }}
      >
        <span className="text-white font-bold text-[13px]">
          🎙️ 沟通话术 · 司庆季触客
        </span>
        <span className="text-white/80 text-[11px]">
          {data.totalCount}人已匹配
        </span>
      </div>

      {/* Priority Section */}
      <div className="px-[14px] pt-[12px] pb-[10px]">
        {/* Label + name chip row */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[12px] text-[#999]">⭐ 优先触客</span>
          <span
            className="px-2 py-0.5 rounded-full text-[11px] font-medium text-white"
            style={{ background: '#3B82F6' }}
          >
            {data.priorityContact.name}
          </span>
        </div>

        {/* Reason tag */}
        <div className="mb-2">
          <span
            className="inline-block px-2 py-0.5 rounded-full text-[11px] text-[#666]"
            style={{ background: '#F3F4F6' }}
          >
            {data.priorityContact.reason}
          </span>
        </div>

        {/* Script preview box */}
        <div
          className="rounded-xl px-[10px] py-[10px] text-[11px] leading-[1.6] text-[#374151]"
          style={{
            background: '#EFF6FF',
            borderLeft: '3px solid #3B82F6',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {data.priorityContact.script}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: '#F3F4F6', margin: '0 14px' }} />

      {/* AI Content Section (replaces general template) */}
      <div className="px-[14px] pt-[10px] pb-[12px]">
        {/* Sub-header */}
        <div
          className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] mb-2"
          style={{ background: 'linear-gradient(135deg, #EFF6FF, #EDE9FE)' }}
        >
          <span className="text-[12px]">📤</span>
          <span className="text-[12px] font-semibold text-[#1E40AF]">AI生成触客内容</span>
          <span className="text-[10px] text-[#64748B] ml-1">根据近期热点话题定制，可一键转发</span>
        </div>

        {/* Content items */}
        <div className="flex flex-col gap-1.5 mb-2.5">
          {contentItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-2.5 py-2 rounded-[10px]"
              style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
            >
              <div
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[16px] flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #E0F2FE, #EDE9FE)' }}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[11px] font-semibold text-[#1E293B]">{item.title}</span>
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
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #0EA5E9, #6366F1)' }}
              >
                {i + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Forwarding script */}
        <div className="text-[10px] text-[#64748B] font-medium mb-1.5">📝 AI生成转发话术：</div>
        <div
          className="rounded-[10px] px-[10px] py-[8px] text-[11px] leading-[1.6] text-[#374151]"
          style={{
            background: '#F1F5F9',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          "{forwardingScript}"
        </div>
      </div>
    </div>
  );
}
