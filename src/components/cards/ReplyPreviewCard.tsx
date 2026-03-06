interface ReplyPreviewCardProps {
  data: Record<string, unknown>;
}

const DEFAULT_REPLY =
  '王哥！三高不是拒之门外的门槛，关键看指标控制情况😊 很多客户和你情况类似，最后都顺利配置了适合自己的方案。你方便的话咱们约个时间当面细聊聊？我帮你做个专属评估，给你一个明确的答复，不让你白等～';

export function ReplyPreviewCard({ data }: ReplyPreviewCardProps) {
  const customerName = (data.customerName as string) || '王哥';
  const reply = (data.reply as string) || DEFAULT_REPLY;

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#F8FAFC] border-b border-[#E5E7EB]">
        <div className="w-8 h-8 rounded-full bg-[#07C160] flex items-center justify-center text-white text-sm">
          {customerName.charAt(0)}
        </div>
        <span className="font-medium text-[14px]">{customerName}</span>
        <svg className="w-4 h-4 text-[#94a3b8] ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <button className="w-5 h-5 rounded ml-auto text-[#94a3b8]">×</button>
      </div>
      <div className="p-3 space-y-2">
        <div className="inline-flex px-3 py-1.5 rounded-lg bg-[#3B82F6] text-white text-[13px]">
          帮我回复截图里的问题
        </div>
        <div className="px-3 py-2 rounded-lg bg-[#F1F5F9] text-[12px] text-[#475569]">
          ◆ 基于客户{customerName}建议您回复: 切换客户 &gt;
        </div>
        <div className="px-3 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
          <p className="text-[14px] text-[#0F172A] leading-relaxed">{reply}</p>
        </div>
        <button
          className="w-full py-2.5 rounded-xl text-white font-medium text-[14px] mt-2"
          style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}
        >
          一键发送
        </button>
      </div>
    </div>
  );
}
