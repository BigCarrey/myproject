import type { QuickReply } from '../types';

interface QuickRepliesProps {
  replies: QuickReply[];
  onSelect: (reply: QuickReply) => void;
}

export function QuickReplies({ replies, onSelect }: QuickRepliesProps) {
  if (replies.length === 0) return null;

  return (
    <div className="px-5 pb-3 animate-stagger-entry">
      <div className="flex flex-wrap gap-2">
        {replies.map((reply, index) => (
          <button
            key={`${reply.value}-${index}`}
            onClick={() => onSelect(reply)}
            className="group glass px-4 py-2 text-[#3B82F6] rounded-[16px] text-[13px] font-medium hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.2)] transition-all shimmer"
          >
            {reply.label}
          </button>
        ))}
      </div>
    </div>
  );
}
