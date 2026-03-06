interface V3MomentsPostCardProps {
  data: Record<string, unknown>;
}

export function V3MomentsPostCard({ data }: V3MomentsPostCardProps) {
  const content = data.content as string | undefined;
  const tags = (data.tags as string[]) || [];
  const persona = (data.persona as string[]) || [];
  const publishTime = data.publishTime as string | undefined;
  const published = data.published as boolean | undefined;

  const highlightHashtags = (text: string) => {
    return text.replace(/#[^#\s]+#/g, (match) => `<span style="color:#07C160;font-weight:500">${match}</span>`);
  };

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #07C160 0%, #10B981 100%)' }} className="px-4 py-3">
        <h3 className="text-white font-semibold text-[15px]">✨ 个性朋友圈内容定制</h3>
        <p className="text-white/80 text-[12px] mt-0.5">AI 万能营销助手 · 已融合人设 + 热点 + 地域信息</p>
      </div>

      {/* Persona tags */}
      {persona.length > 0 && (
        <div className="px-3 py-2 bg-[#f0fdf4] border-b border-green-100 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-green-600 font-medium">融合要素：</span>
          {persona.map((p, i) => (
            <span key={i} className="text-[11px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
              {p}
            </span>
          ))}
        </div>
      )}

      {/* WeChat Moments preview */}
      <div className="p-3">
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          {/* Moments header bar */}
          <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-[13px]">
              李
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#576B95]">小李</p>
              <p className="text-[11px] text-gray-400">刚刚</p>
            </div>
          </div>

          {/* Post content */}
          <div className="px-3 py-3">
            <div
              className="text-[14px] leading-relaxed text-gray-800"
              dangerouslySetInnerHTML={{ __html: highlightHashtags(content || '') }}
            />

            {/* Image placeholder */}
            <div className="flex gap-1.5 mt-2.5">
              <div className="w-[72px] h-[72px] rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex flex-col items-center justify-center">
                <span className="text-[24px]">🏃</span>
                <span className="text-[10px] text-orange-600 mt-0.5">成绩图</span>
              </div>
              <div className="w-[72px] h-[72px] rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center justify-center">
                <span className="text-[24px]">📰</span>
                <span className="text-[10px] text-blue-600 mt-0.5">新闻截图</span>
              </div>
            </div>
          </div>

          {/* Tags row */}
          {tags.length > 0 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1">
              {tags.map((tag, i) => (
                <span key={i} className="text-[11px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-100">
            <span className="text-[12px] text-gray-400">👍 赞  💬 评论</span>
            <span className="text-[12px] text-gray-400">···</span>
          </div>
        </div>

        {/* Publish status */}
        {published && (
          <div className="mt-3 flex items-center gap-2 bg-[#f0fdf4] rounded-lg px-3 py-2.5 border border-green-200">
            <span className="text-[18px]">✅</span>
            <div>
              <p className="text-[13px] font-semibold text-green-700">朋友圈发布成功</p>
              <p className="text-[12px] text-green-600">{publishTime} · 预计触达潜在客户 43 位</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
