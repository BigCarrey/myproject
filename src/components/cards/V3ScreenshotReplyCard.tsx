interface V3ScreenshotReplyCardProps {
  data: Record<string, unknown>;
}

export function V3ScreenshotReplyCard({ data }: V3ScreenshotReplyCardProps) {
  const customerName = data.customerName as string | undefined;
  const incomingMessage = data.incomingMessage as string | undefined;
  const analysis = data.analysis as string | undefined;
  const suggestedReply = data.suggestedReply as string | undefined;
  const analysisPoints = (data.analysisPoints as string[]) || [];

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }} className="px-4 py-3">
        <h3 className="text-white font-semibold text-[15px]">📸 截图帮回功能</h3>
        <p className="text-white/80 text-[12px] mt-0.5">输入法 AI · 识别截图内容，智能生成最优回复</p>
      </div>

      <div className="p-3 space-y-3">
        {/* Incoming message simulation */}
        {incomingMessage && (
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-[11px] text-gray-400 mb-1.5">📱 微信私信 · 来自 {customerName}</p>
            <div className="flex gap-2 items-start">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0 mt-0.5">
                王
              </div>
              <div className="bg-white rounded-[12px] rounded-tl-sm px-3 py-2 shadow-sm border border-gray-100">
                <p className="text-[13px] text-gray-800 leading-relaxed">{incomingMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* iOS Keyboard + AI Overlay simulation */}
        <div className="rounded-xl overflow-hidden border border-gray-200" style={{ background: '#D1D5DB' }}>
          {/* Input bar simulation */}
          <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#F2F3F7' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 12c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-2.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </div>
            <div className="flex-1 h-8 rounded-full bg-white flex items-center px-3">
              <div className="w-0.5 h-4 bg-blue-500 animate-pulse" />
            </div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 text-[18px]">😊</div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 text-[18px]">⊕</div>
          </div>

          {/* AI帮回复 floating shortcut bar */}
          <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: '#E5E7EB' }}>
            <span style={{ color: '#4F46E5' }} className="text-[14px]">✦</span>
            <span className="text-[12px] font-medium text-gray-700">截图帮回</span>
            <span className="text-gray-300 text-[12px]">▶</span>
            <div className="ml-auto flex items-center gap-1">
              <span className="text-[11px] text-gray-500">分词</span>
              <span className="text-gray-300">|</span>
              <span className="text-[11px] font-medium" style={{ color: '#4F46E5' }}>AI</span>
              <span className="text-gray-300">|</span>
              <span className="text-[11px] text-gray-500">✂</span>
            </div>
          </div>

          {/* AI帮回复 overlay panel */}
          <div className="mx-2 mb-2 rounded-xl overflow-hidden shadow-lg" style={{ background: 'white' }}>
            {/* Panel header */}
            <div className="flex items-center justify-between px-3 py-2" style={{ background: '#F8F9FF', borderBottom: '1px solid #E5E7EB' }}>
              <div className="flex items-center gap-1.5">
                <span style={{ color: '#4F46E5' }} className="text-[13px]">✦</span>
                <span className="text-[13px] font-semibold text-gray-800">AI 帮回复</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white rounded-full px-2 py-0.5 border border-gray-200">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-[8px] font-bold">王</div>
                  <span className="text-[12px] text-gray-700 font-medium">{customerName}</span>
                  <span className="text-[11px] text-gray-400">▾</span>
                </div>
                <span className="text-gray-400 text-[15px]">×</span>
              </div>
            </div>

            {/* Screenshot area */}
            <div className="flex items-center gap-2 px-3 py-2.5">
              {/* Screenshot thumbnail */}
              <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 relative">
                {/* Simulated WeChat screenshot */}
                <div className="w-full h-full bg-gray-100 flex flex-col justify-end p-1 gap-0.5">
                  <div className="flex justify-end">
                    <div className="h-2 w-8 rounded-full bg-green-300 opacity-80" />
                  </div>
                  <div className="flex justify-start">
                    <div className="h-2 w-10 rounded-full bg-white border border-gray-200" />
                  </div>
                  <div className="flex justify-end">
                    <div className="h-2 w-6 rounded-full bg-green-300 opacity-80" />
                  </div>
                </div>
                <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-red-400 flex items-center justify-center">
                  <span className="text-white text-[8px]">×</span>
                </div>
              </div>

              {/* Add more placeholder */}
              <div className="w-14 h-14 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <span className="text-gray-400 text-[20px]">+</span>
              </div>

              {/* Send button */}
              <div className="ml-auto w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#4F46E5' }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Keyboard rows */}
          <div className="px-1.5 pb-1.5 space-y-1">
            {[
              ['1','2','3','4','5','6','7','8','9','0'],
              ['Q','W','E','R','T','Y','U','I','O','P'],
              ['A','S','D','F','G','H','J','K','L'],
            ].map((row, ri) => (
              <div key={ri} className="flex justify-center gap-1">
                {row.map((k) => (
                  <div key={k} className="h-7 min-w-[26px] flex-1 max-w-[34px] rounded-md bg-white shadow-sm flex items-center justify-center text-[12px] font-medium text-gray-700">
                    {k}
                  </div>
                ))}
              </div>
            ))}
            <div className="flex gap-1">
              <div className="h-7 flex-none w-[42px] rounded-md bg-gray-300 flex items-center justify-center text-[11px] text-gray-600 font-medium">符号</div>
              <div className="h-7 flex-1 rounded-md bg-white shadow-sm flex items-center justify-center text-[12px] text-gray-700">——</div>
              <div className="h-7 flex-none px-2 rounded-md bg-[#4F46E5] flex items-center justify-center text-[12px] text-white font-medium">发送</div>
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        {(analysis || analysisPoints.length > 0) && (
          <div className="bg-[#F5F3FF] rounded-xl p-3 border border-purple-100">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[13px]">🔍</span>
              <span className="text-[13px] font-semibold text-purple-800">AI 识别分析</span>
            </div>
            {analysis && <p className="text-[13px] text-purple-700 leading-relaxed mb-2">{analysis}</p>}
            {analysisPoints.map((pt, i) => (
              <div key={i} className="flex gap-1.5 items-start mt-1">
                <span className="text-purple-400 mt-0.5 flex-shrink-0">•</span>
                <p className="text-[12px] text-purple-700 leading-relaxed">{pt}</p>
              </div>
            ))}
          </div>
        )}

        {/* Suggested reply */}
        {suggestedReply && (
          <div className="bg-[#F0FDF4] rounded-xl p-3 border border-green-200">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[13px]">💬</span>
              <span className="text-[13px] font-semibold text-green-800">推荐回复</span>
            </div>
            <p className="text-[13px] text-gray-800 leading-relaxed">{suggestedReply}</p>
          </div>
        )}
      </div>
    </div>
  );
}
