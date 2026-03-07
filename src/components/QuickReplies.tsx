import type { QuickReply } from '../types';

interface QuickRepliesProps {
  replies: QuickReply[];
  onSelect: (reply: QuickReply) => void;
}

export function QuickReplies({ replies, onSelect }: QuickRepliesProps) {
  if (replies.length === 0) return null;

  return (
    <div className="px-5 pb-3 animate-fade-in-up">
      <div className="flex flex-wrap gap-2">
        {replies.map((reply, index) =>
          reply.primary ? (
            <button
              key={`${reply.value}-${index}`}
              onClick={() => onSelect(reply)}
              className="quick-reply-primary"
            >
              {reply.label}
            </button>
          ) : (
            <button
              key={`${reply.value}-${index}`}
              onClick={() => onSelect(reply)}
              className="px-4 py-2 rounded-[20px] text-[13px] font-medium text-[#1D4ED8] transition-all duration-300 border border-white/80 hover:border-[#3B82F6]/30 active:text-white active:border-transparent"
              style={{
                background: 'rgba(255,255,255,0.70)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 8px 30px 0 rgba(37,99,235,0.06)',
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, #3B82F6, #1D4ED8)';
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.70)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.70)';
              }}
            >
              {reply.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}
