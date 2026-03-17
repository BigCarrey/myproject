interface GridCell {
  count: number;
  pendingCount: number;
}

interface GridRow {
  cold: GridCell;
  low: GridCell;
  medHigh: GridCell;
}

interface FieldCustomerPanoramaCardProps {
  data: {
    touchCustomer: { done: number; total: number };
    faceVisit: { done: number; total: number };
    invite: { done: number; total: number };
    monthlyWarmUp: number;
    grid: {
      a: GridRow;
      bc: GridRow;
      def: GridRow;
    };
  };
}

const TEMP_COLS = [
  { key: 'cold' as const, label: '冷却', pendingLabel: '待触客' },
  { key: 'low' as const, label: '低温', pendingLabel: '待面访', color: '#E8900C', bgColor: '#FFF8ED', borderColor: '#FFE4B5' },
  { key: 'medHigh' as const, label: '中高温', pendingLabel: '待邀约', color: '#3B6DE5', bgColor: '#EDF3FF', borderColor: '#C4D8FF' },
];

const ROW_LABELS = [
  { key: 'a' as const, label: 'A' },
  { key: 'bc' as const, label: 'BC' },
  { key: 'def' as const, label: 'DEF' },
];

export default function FieldCustomerPanoramaCard({ data }: FieldCustomerPanoramaCardProps) {
  const { touchCustomer, faceVisit, invite, monthlyWarmUp, grid } = data;

  const stats = [
    { label: '触客', done: touchCustomer.done, total: touchCustomer.total, sub: '已完成/总数' },
    { label: '面访', done: faceVisit.done, total: faceVisit.total, sub: '已完成/总数' },
    { label: '邀约', done: invite.done, total: invite.total, sub: '已完成/总数' },
    { label: '当月升温', value: monthlyWarmUp, sub: '总数' },
  ];

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      border: '1px solid #E8EFFE',
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(59,94,219,0.09)',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1D4ED8 0%, #4F46E5 100%)',
        padding: '11px 14px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 7,
      }}>
        <span style={{ fontSize: 16 }}>🗺️</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>客户全景大图</span>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        padding: '12px 10px 8px',
        textAlign: 'center',
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            borderRight: i < stats.length - 1 ? '1px solid #F1F5F9' : 'none',
          }}>
            <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#1E293B', lineHeight: 1.2 }}>
              {'value' in s ? (
                s.value
              ) : (
                <>
                  {s.done}<span style={{ fontSize: 13, fontWeight: 500, color: '#94A3B8' }}>/{s.total}</span>
                </>
              )}
            </div>
            <div style={{ fontSize: 9, color: '#94A3B8', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Divider with label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px 14px 8px',
        gap: 8,
      }}>
        <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>本月经营分布</span>
        <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
      </div>

      {/* Nine-grid */}
      <div style={{ padding: '0 10px 12px' }}>
        {/* Column headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '32px 1fr 1fr 1fr',
          gap: 6,
          marginBottom: 6,
        }}>
          <div />
          {TEMP_COLS.map(col => (
            <div key={col.key} style={{
              textAlign: 'center',
              fontSize: 11,
              fontWeight: 600,
              color: '#475569',
            }}>
              {col.label}
            </div>
          ))}
        </div>

        {/* Grid rows */}
        {ROW_LABELS.map(row => {
          const rowData = grid[row.key];
          return (
            <div key={row.key} style={{
              display: 'grid',
              gridTemplateColumns: '32px 1fr 1fr 1fr',
              gap: 6,
              marginBottom: 6,
            }}>
              {/* Row label */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: '#475569',
              }}>
                {row.label}
              </div>

              {/* Cells */}
              {TEMP_COLS.map(col => {
                const cell = rowData[col.key];
                const isHighlight = col.key !== 'cold';
                const bgColor = isHighlight ? (col.bgColor || '#F8FAFC') : '#F8FAFC';
                const borderColor = isHighlight ? (col.borderColor || '#E2E8F0') : '#E2E8F0';
                const accentColor = isHighlight ? (col.color || '#475569') : '#475569';

                return (
                  <div key={col.key} style={{
                    background: bgColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: 10,
                    padding: '8px 6px',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: '#1E293B',
                      lineHeight: 1.2,
                    }}>
                      {cell.count}<span style={{ fontSize: 12, fontWeight: 500 }}>人</span>
                    </div>
                    <div style={{
                      fontSize: 9,
                      color: accentColor,
                      fontWeight: isHighlight ? 600 : 400,
                      marginTop: 2,
                    }}>
                      {col.pendingLabel} {cell.pendingCount}人
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Bottom column labels */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '32px 1fr 1fr 1fr',
          gap: 6,
        }}>
          <div />
          {TEMP_COLS.map(col => (
            <div key={col.key} style={{
              textAlign: 'center',
              fontSize: 10,
              color: '#94A3B8',
            }}>
              {col.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
