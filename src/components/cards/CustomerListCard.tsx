interface CustomerListCardProps {
  data: Record<string, unknown>;
}

interface CustomerListItem {
  name: string;
  temperature: '高温' | '中温' | '低温';
  value: '高价值' | '中价值' | '低价值';
  action: string;
  actionIcon: string;
  tags: string[];
  lastContact: string;
}

export function CustomerListCard({ data }: CustomerListCardProps) {
  const customers = data.customers as CustomerListItem[];
  const summary = data.summary as string | undefined;
  const totalCount = (data.totalCount as number) ?? customers.length;
  const displayCount = 3;
  const displayCustomers = customers.slice(0, displayCount);

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      {/* 简洁的标题 */}
      <div className="px-4 py-3 border-b border-white/50">
        <h3 className="text-[#0F172A] font-medium text-sm">本月经营客户（{totalCount}）</h3>
      </div>

      {/* 客户列表 */}
      <div className="p-3 space-y-2">
        {displayCustomers.map((customer, index) => (
            <div
              key={index}
              className="glass border border-white/50 rounded-xl p-3 hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.15)] transition-all"
            >
              {/* 上部：头像 + 信息 */}
              <div className="flex items-start gap-3">
                {/* 头像 - 统一浅蓝色圆形 */}
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#3B82F6] font-medium text-sm flex-shrink-0">
                  {customer.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  {/* 客户名称和最后联系时间 */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-medium text-sm text-[#0F172A]">{customer.name}</span>
                    <span className="text-xs text-[#64748B]">{customer.lastContact}联系</span>
                  </div>

                  {/* 标签 - 简洁样式，最多3个 */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {[customer.temperature, customer.value, ...customer.tags].slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs text-[#475569]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 经营动作 - 文案与头像左对齐，按钮右侧 */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/50">
                <span className="text-xs text-[#0F172A] truncate mr-3">
                  {customer.actionIcon} {customer.action}
                </span>
                <button className="text-xs text-[#3B82F6] border border-[#3B82F6] px-3 py-1 rounded-full hover:bg-[#EFF6FF] transition-colors whitespace-nowrap flex-shrink-0">
                  去经营
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* 更多客户按钮 */}
      {totalCount > displayCount && (
        <div className="px-3 pb-3">
          <button className="w-full py-2.5 text-sm text-[#475569] hover:text-[#0F172A] border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition-colors flex items-center justify-center gap-1">
            <span>查看更多客户</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* AI总结 - 简化样式 */}
      {summary && (
        <div className="px-3 pb-3">
          <div className="bg-[#EFF6FF] rounded-xl p-3 border border-[#BFDBFE]">
            <div className="flex items-start gap-2">
              <span className="text-sm">💡</span>
              <p className="text-xs text-[#475569] leading-relaxed">{summary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
