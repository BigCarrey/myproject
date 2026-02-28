import { useChatContext } from '../../contexts/ChatContext';

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
  /** 生日，如 9/12 */
  birthday?: string;
  /** 生存金待领取 */
  survivalFund?: boolean;
  /** 可点击时触发的快捷回复 */
  quickReply?: { label: string; value: string };
}

export function CustomerListCard({ data }: CustomerListCardProps) {
  const customers = data.customers as CustomerListItem[];
  const summary = data.summary as string | undefined;
  const totalCount = (data.totalCount as number) ?? customers.length;
  const displayCount = (data.displayCount as number) ?? 3;
  const title = (data.title as string) ?? '本月经营客户';
  const actionable = (data.actionable as boolean) ?? false;
  const displayCustomers = customers.slice(0, displayCount);
  const { onQuickReply } = useChatContext();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* 简洁的标题 */}
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-gray-800 font-medium text-sm">{title}（{totalCount}）</h3>
      </div>

      {/* 客户列表 */}
      <div className="p-3 space-y-2">
        {displayCustomers.map((customer, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
            >
              {/* 上部：头像 + 信息 */}
              <div className="flex items-start gap-3">
                {/* 头像 - 统一浅蓝色圆形 */}
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm flex-shrink-0">
                  {customer.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  {/* 客户名称、提醒标识和最后联系时间 */}
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                    <span className="font-medium text-sm text-gray-800">{customer.name}</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {customer.birthday && (
                        <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                          🎂 生日 {customer.birthday}
                        </span>
                      )}
                      {customer.survivalFund && (
                        <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                          💰 生存金待领取
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{customer.lastContact}联系</span>
                    </div>
                  </div>

                  {/* 标签 - 简洁样式，最多3个 */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {[customer.temperature, customer.value, ...customer.tags].slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs text-gray-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 经营动作 - 文案与头像左对齐，按钮右侧 */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-800 truncate mr-3">
                  {customer.actionIcon} {customer.action}
                </span>
                {actionable && customer.quickReply && onQuickReply ? (
                  <button
                    onClick={() => onQuickReply(customer.quickReply!)}
                    className="text-xs text-blue-600 border border-blue-600 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    一键触客
                  </button>
                ) : (
                  <button className="text-xs text-blue-600 border border-blue-600 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors whitespace-nowrap flex-shrink-0">
                    去经营
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* 更多客户按钮 */}
      {totalCount > displayCount && (
        <div className="px-3 pb-3">
          <button className="w-full py-2.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
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
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-start gap-2">
              <span className="text-sm">💡</span>
              <p className="text-xs text-gray-600 leading-relaxed">{summary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
