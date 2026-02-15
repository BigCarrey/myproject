import { customers } from '../../data/customers';

interface CustomerCardProps {
  data: Record<string, unknown>;
}

export function CustomerCard({ data }: CustomerCardProps) {
  const customer = customers.find((c) => c.id === data.customerId);
  if (!customer) return null;

  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  };

  const priorityLabels = { high: '高优先', medium: '中优先', low: '低优先' };

return (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden mb-4">
    {/* 1. 增加整体内边距 p-5 */}
    <div className="p-5">
      
      {/* 2. 头部信息区域：增加间距 gap-4 */}
      <div className="flex items-start gap-4 mb-4">
        {/* 头像增大一点，使用更柔和的背景 */}
        <div className="w-12 h-12 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-500 font-bold text-lg">
          {customer.avatar}
        </div>
        
        <div className="flex-1 pt-0.5">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-base text-gray-800">{customer.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-lg ${priorityColors[customer.priority]}`}>
              {priorityLabels[customer.priority]}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {customer.age}岁 · {customer.occupation}
          </p>
        </div>
      </div>

      {/* 3. 标签区域：增加间距 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {customer.tags.map((tag) => (
          <span key={tag} className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md">
            {tag}
          </span>
        ))}
      </div>

      {/* 4. 重点备注：模仿新图中的样式，添加左侧装饰条和更大的内间距 */}
      {customer.notes && (
        <div className="relative p-3 bg-orange-50/50 rounded-xl text-sm text-orange-800 border-l-4 border-orange-300">
          <span className="flex items-start gap-1">
            <span className="mt-0.5">💡</span>
            <span className="leading-relaxed">{customer.notes}</span>
          </span>
        </div>
      )}

      {/* 5. 详细信息（可选展开部分） */}
      {!!data.detailed && (
        <div className="mt-4 pt-4 border-t border-gray-50 space-y-2 text-sm text-gray-600">
           <p>📍 {customer.address}</p>
           <p>📅 上次联系：{customer.lastContact}</p>
        </div>
      )}
    </div>
  </div>
);
}
