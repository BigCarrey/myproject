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
  <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden mb-3">
    <div className="p-3">

      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-500 font-bold text-base">
          {customer.avatar}
        </div>

        <div className="flex-1 pt-0.5">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm text-gray-800">{customer.name}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${priorityColors[customer.priority]}`}>
              {priorityLabels[customer.priority]}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {customer.age}岁 · {customer.occupation}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {customer.tags.map((tag) => (
          <span key={tag} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>

      {customer.notes && (
        <div className="relative p-2 bg-orange-50/50 rounded-lg text-xs text-orange-800 border-l-3 border-orange-300">
          <span className="flex items-start gap-1">
            <span className="mt-0.5">💡</span>
            <span className="leading-relaxed">{customer.notes}</span>
          </span>
        </div>
      )}

      {!!data.detailed && (
        <div className="mt-3 pt-3 border-t border-gray-50 space-y-1.5 text-xs text-gray-600">
           <p>📍 {customer.address}</p>
           <p>📅 上次联系：{customer.lastContact}</p>
        </div>
      )}
    </div>
  </div>
);
}
