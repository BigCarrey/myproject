import type { Message } from '../types';
import { CustomerCard } from './cards/CustomerCard';
import { PlanCard } from './cards/PlanCard';
import { ProductCard } from './cards/ProductCard';
import { CoverageGapCard } from './cards/CoverageGapCard';
import { TeamDashboard } from './cards/TeamDashboard';
import { MemberCard } from './cards/MemberCard';
import { VisitSummaryCard } from './cards/VisitSummaryCard';
import { WorkSummaryCard } from './cards/WorkSummaryCard';
import { ScheduleCard } from './cards/ScheduleCard';
import { IncomeCard } from './cards/IncomeCard';
import { NearbyCustomersCard } from './cards/NearbyCustomersCard';
import { MonthlyPlanCard } from './cards/MonthlyPlanCard';
import { CustomerGridCard } from './cards/CustomerGridCard';
import { CustomerListCard } from './cards/CustomerListCard';
import { AutoStepProgress } from './cards/AutoStepProgress';
import { CustomerProfileGrid } from './cards/CustomerProfileGrid';
import { CoverageAnalysisCard } from './cards/CoverageAnalysisCard';
import { ProductPlansCard } from './cards/ProductPlansCard';
import { CollapsibleStepCard } from './cards/CollapsibleStepCard';
import { ObjectionHandlingCard } from './cards/ObjectionHandlingCard';
import { VisitStrategyCard } from './cards/VisitStrategyCard';
import { AbilityAnalysisCard } from './cards/AbilityAnalysisCard';
import { CoachingPlanCard } from './cards/CoachingPlanCard';
import { LearningPlanCard } from './cards/LearningPlanCard';
import { V2TargetSegmentCard } from './cards/V2TargetSegmentCard';
import { V2EventCalendarCard } from './cards/V2EventCalendarCard';
import { V2MaterialKitCard } from './cards/V2MaterialKitCard';
import { V2DailyActionCard } from './cards/V2DailyActionCard';
import { V2VoiceReviewCard } from './cards/V2VoiceReviewCard';
import { V2CustomerArchiveCard } from './cards/V2CustomerArchiveCard';

interface MessageBubbleProps {
  message: Message;
  onSpeak?: (text: string) => void;
}

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>')
    .replace(
      /\|(.+)\|/g,
      (match) => {
        const cells = match.split('|').filter(Boolean);
        if (cells.every((c) => c.trim().match(/^[-:]+$/))) return '';
        const tds = cells.map((c) => `<td class="px-2 py-1.5 border border-[#e0e4ff]/60 text-[14px]">${c.trim()}</td>`).join('');
        return `<tr>${tds}</tr>`;
      }
    );
}

function TextContent({ content, onSpeak }: { content: string; onSpeak?: (text: string) => void }) {
  const hasTable = content.includes('|') && content.includes('---');
  let beforeTable = content;
  let tableHtml = '';
  let afterTable = '';

  if (hasTable) {
    const lines = content.split('\n');
    const tableStart = lines.findIndex((l) => l.trim().startsWith('|'));
    const tableEnd = lines.findLastIndex((l) => l.trim().startsWith('|'));

    if (tableStart >= 0) {
      beforeTable = lines.slice(0, tableStart).join('\n');
      afterTable = lines.slice(tableEnd + 1).join('\n');

      const tableLines = lines.slice(tableStart, tableEnd + 1).filter(
        (l) => !l.trim().match(/^\|[-:| ]+\|$/)
      );

      const headers = tableLines[0]?.split('|').filter(Boolean).map((h) => h.trim()) || [];
      const rows = tableLines.slice(1);

      tableHtml = `<table class="w-full border-collapse my-2 text-[14px]"><thead><tr>${headers
        .map((h) => `<th class="px-2 py-1.5 bg-[#f8f9ff] border border-[#e0e4ff]/60 text-left font-medium text-[#667eea]">${h}</th>`)
        .join('')}</tr></thead><tbody>${rows
        .map((row) => {
          const cells = row.split('|').filter(Boolean).map((c) => c.trim());
          return `<tr>${cells.map((c) => `<td class="px-2 py-1.5 border border-[#e0e4ff]/60">${c}</td>`).join('')}</tr>`;
        })
        .join('')}</tbody></table>`;
    }
  }

  return (
    <div className="relative group">
      {beforeTable && (
        <div
          className="text-[15px] leading-[1.5] whitespace-pre-wrap text-[#333]"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(beforeTable) }}
        />
      )}
      {tableHtml && (
        <div className="overflow-x-auto" dangerouslySetInnerHTML={{ __html: tableHtml }} />
      )}
      {afterTable && (
        <div
          className="text-[15px] leading-[1.5] whitespace-pre-wrap text-[#333]"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(afterTable) }}
        />
      )}
      {onSpeak && (
        <button
          onClick={() => onSpeak(content)}
          className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#f8f9ff] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          title="朗读"
        >
          <svg className="w-3 h-3 text-[#667eea]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function MessageBubble({ message, onSpeak }: MessageBubbleProps) {
  const isAi = message.role === 'ai';

  const renderContent = () => {
    switch (message.type) {
      case 'customer-card':
        return <CustomerCard data={message.data as Record<string, unknown>} />;
      case 'plan-card':
        return <PlanCard data={message.data as Record<string, unknown>} />;
      case 'product-card':
        return <ProductCard data={message.data as Record<string, unknown>} />;
      case 'coverage-gap':
        return <CoverageGapCard data={message.data as Record<string, unknown>} />;
      case 'team-dashboard':
        return <TeamDashboard />;
      case 'member-card':
        return <MemberCard data={message.data as Record<string, unknown>} />;
      case 'visit-summary':
        return <VisitSummaryCard data={message.data as Record<string, unknown>} />;
      case 'work-summary':
        return <WorkSummaryCard data={message.data as Record<string, unknown>} />;
      case 'schedule-card':
        return <ScheduleCard data={message.data as Record<string, unknown>} />;
      case 'income-card':
        return <IncomeCard data={message.data as Record<string, unknown>} />;
      case 'nearby-customers':
        return <NearbyCustomersCard data={message.data as Record<string, unknown>} />;
      case 'monthly-plan':
        return <MonthlyPlanCard data={message.data as Record<string, unknown>} />;
      case 'customer-grid':
        return <CustomerGridCard data={message.data as Record<string, unknown>} />;
      case 'customer-list':
        return <CustomerListCard data={message.data as Record<string, unknown>} />;
      case 'auto-step-progress':
        return <AutoStepProgress data={message.data as Record<string, unknown>} />;
      case 'customer-profile-grid':
        return <CustomerProfileGrid data={message.data as Record<string, unknown>} />;
      case 'coverage-analysis':
        return <CoverageAnalysisCard data={message.data as Record<string, unknown>} />;
      case 'product-plans':
        return <ProductPlansCard data={message.data as Record<string, unknown>} />;
      case 'collapsible-step':
        return <CollapsibleStepCard data={message.data as Record<string, unknown>} />;
      case 'objection-handling':
        return <ObjectionHandlingCard data={message.data as Record<string, unknown>} />;
      case 'visit-strategy':
        return <VisitStrategyCard data={message.data as Record<string, unknown>} />;
      case 'ability-analysis':
        return <AbilityAnalysisCard data={message.data as Record<string, unknown>} />;
      case 'coaching-plan':
        return <CoachingPlanCard data={message.data as Record<string, unknown>} />;
      case 'learning-plan':
        return <LearningPlanCard data={message.data as Record<string, unknown>} />;
      // V2 cards
      case 'v2-target-segment':
        return <V2TargetSegmentCard data={message.data as Record<string, unknown>} />;
      case 'v2-event-calendar':
        return <V2EventCalendarCard data={message.data as Record<string, unknown>} />;
      case 'v2-material-kit':
        return <V2MaterialKitCard data={message.data as Record<string, unknown>} />;
      case 'v2-daily-action':
        return <V2DailyActionCard data={message.data as Record<string, unknown>} />;
      case 'v2-voice-review':
        return <V2VoiceReviewCard data={message.data as Record<string, unknown>} />;
      case 'v2-customer-archive':
        return <V2CustomerArchiveCard data={message.data as Record<string, unknown>} />;
      default:
        return <TextContent content={message.content} onSpeak={isAi ? onSpeak : undefined} />;
    }
  };

  if (!isAi) {
    return (
      <div className="flex justify-end mb-3 animate-fade-in-up" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
        <div
          className="max-w-[85%] px-4 py-2.5 rounded-[18px] text-white"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <p className="text-[15px] leading-[1.5]">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 animate-slide-in-left" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
      {message.type === 'text' ? (
        <div className="max-w-[85%] bg-white rounded-[18px] px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          {renderContent()}
        </div>
      ) : (
        <div className="max-w-[92%] flex flex-col gap-3">
          {renderContent()}
        </div>
      )}
    </div>
  );
}
