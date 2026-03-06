interface WechatPreviewCardProps {
  data: Record<string, unknown>;
}

export function WechatPreviewCard({ data }: WechatPreviewCardProps) {
  const message = (data.message as string) || '';
  const customerName = (data.customerName as string) || '王哥';

  return (
    <div className="rounded-[24px] overflow-hidden border border-[#E5E7EB] bg-white shadow-sm">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#F7F7F7] border-b border-[#E5E7EB]">
        <span className="text-[#0F172A] font-medium">&lt;</span>
        <span className="font-medium text-[15px] text-[#0F172A]">{customerName}</span>
      </div>
      <div className="p-4 min-h-[80px] bg-[#EDEDED]">
        <div className="flex gap-2">
          <div className="w-9 h-9 rounded-full bg-[#07C160] flex items-center justify-center text-white text-sm flex-shrink-0">
            {customerName.charAt(0)}
          </div>
          <div className="max-w-[80%] px-3 py-2 rounded-[8px] bg-white border border-[#E5E7EB]">
            <p className="text-[14px] text-[#0F172A] leading-relaxed">{message}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 bg-[#F7F7F7] border-t border-[#E5E7EB]">
        <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center">
          <svg className="w-4 h-4 text-[#64748B]" fill="currentColor" viewBox="0 0 24 24">
            <rect x="10" y="4" width="4" height="12" rx="2" />
            <path d="M6 12c0 3.314 2.686 6 6 6s6-2.686 6-6" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div className="flex-1 h-8 rounded-lg bg-white border border-[#E5E7EB] px-3 text-[13px] text-[#94a3b8] flex items-center">
          说点什么...
        </div>
        <div className="w-8 h-8 rounded flex items-center justify-center text-[#94a3b8]">😊</div>
        <div className="w-8 h-8 rounded flex items-center justify-center text-[#94a3b8]">+</div>
      </div>
    </div>
  );
}
