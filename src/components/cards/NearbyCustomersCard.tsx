interface NearbyCustomersCardProps {
  data: Record<string, unknown>;
}

interface NearbyCustomer {
  name: string;
  distance: string;
  address: string;
  tag: string;
  lastContact: string;
  note: string;
}

export function NearbyCustomersCard({ data }: NearbyCustomersCardProps) {
  const customers = data.customers as NearbyCustomer[];

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] px-4 py-2.5">
        <h3 className="text-white font-semibold text-[15px]">📍 附近客户推荐</h3>
      </div>
      <div className="p-2 space-y-2">
        {customers.map((customer, index) => (
          <div
            key={index}
            className="border border-white/50 rounded-xl p-3 flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#3B82F6] font-medium text-[15px] flex-shrink-0">
              {customer.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-[15px] text-[#0F172A]">{customer.name}</span>
                <span className="text-[13px] text-[#3B82F6] font-medium flex items-center gap-0.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  {customer.distance}
                </span>
              </div>
              <p className="text-[13px] text-[#475569]">{customer.address}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[13px] bg-[#F8FAFC] text-[#475569] px-2 py-0.5 rounded-lg border border-[#E2E8F0]">
                  {customer.tag}
                </span>
                <span className="text-[13px] text-[#475569]">
                  {customer.lastContact}联系
                </span>
              </div>
              <p className="text-[13px] text-[#475569] mt-1">💡 {customer.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
