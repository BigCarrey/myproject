interface MomentPreviewCardProps {
  data: Record<string, unknown>;
}

export function MomentPreviewCard({ data }: MomentPreviewCardProps) {
  const content = (data.content as string) || '周末半马冲线瞬间，汗流浃背却格外踏实～ 就像做保险这两年，每一次为客户规划保障方案，都和跑步一样：前期充分准备，过程稳步推进，最终才能让客户收获安心。最近看到 #国内马拉松赛事安全保障升级# 的新闻，更觉得"保障"不分场景 —— 运动需要护具和医疗支持，生活需要保险和规划兜底。如果你也热爱运动，或想给家人配置全面保障，随时找我聊聊呀～';

  return (
    <div className="crystal rounded-[24px] overflow-hidden border border-white/80">
      <div className="bg-gradient-to-br from-[#07C160] to-[#06AD56] px-4 py-2.5">
        <h3 className="text-white font-semibold text-[15px]">朋友圈预览</h3>
      </div>
      <div className="p-3 bg-[#F7F7F7]">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-[#07C160] flex items-center justify-center text-white font-medium flex-shrink-0">
            李
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-[#0F172A]">小李</span>
              <span className="text-[12px] text-[#94a3b8]">刚刚</span>
            </div>
            <p className="text-[14px] text-[#0F172A] leading-relaxed whitespace-pre-wrap">{content}</p>
            <div className="flex gap-2 mt-2">
              <div className="w-20 h-20 rounded-lg bg-[#E5E7EB] flex items-center justify-center text-[10px] text-[#64748B]">
                半马成绩图
              </div>
              <div className="w-20 h-20 rounded-lg bg-[#E5E7EB] flex items-center justify-center text-[10px] text-[#64748B]">
                赛事新闻截图
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
