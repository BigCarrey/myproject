import type { Message } from '../types';
import { ProgressListCard } from './cards/ProgressListCard';
import { AgentReportCard } from './cards/AgentReportCard';
import { AICallCard } from './cards/AICallCard';
import { DataCaptureCard } from './cards/DataCaptureCard';
import { RiskRadarCard } from './cards/RiskRadarCard';
import { RootCauseCard } from './cards/RootCauseCard';
import { MeetingTargetCard } from './cards/MeetingTargetCard';
import { MeetingScriptCard } from './cards/MeetingScriptCard';
import { ResponseStrategyCard } from './cards/ResponseStrategyCard';
import { RecordingCard } from './cards/RecordingCard';
import { MeetingResultCard } from './cards/MeetingResultCard';
import { PlanDeliveryCard } from './cards/PlanDeliveryCard';
import { ReportUploadCard } from './cards/ReportUploadCard';
import { ReportPreviewCard } from './cards/ReportPreviewCard';
import { MaterialConfigCard } from './cards/MaterialConfigCard';
import { MaterialPreviewCard } from './cards/MaterialPreviewCard';
import { MaterialDistributeCard } from './cards/MaterialDistributeCard';
import { CaseSearchCard } from './cards/CaseSearchCard';
import { CaseResultCard } from './cards/CaseResultCard';
import { CaseInterviewCard } from './cards/CaseInterviewCard';
import { CaseVideoCard } from './cards/CaseVideoCard';
import { FieldMomentsPostCard } from './cards/FieldMomentsPostCard';
import { FieldAIAnalysisCard } from './cards/FieldAIAnalysisCard';
import { FieldReplyPreviewCard } from './cards/FieldReplyPreviewCard';
import { FieldCustomerProfileCard } from './cards/FieldCustomerProfileCard';
import { FieldNeedsAnalysisCard } from './cards/FieldNeedsAnalysisCard';
import { FieldSalesScriptCard } from './cards/FieldSalesScriptCard';
import { FieldGapDiagnosisCard } from './cards/FieldGapDiagnosisCard';
import { FieldProductPlansCard } from './cards/FieldProductPlansCard';
import { FieldCommissionCard } from './cards/FieldCommissionCard';
import { FieldMaterialsCard } from './cards/FieldMaterialsCard';

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
        .map((h) => `<th class="px-2 py-1.5 bg-blue-50 border border-[#BFDBFE]/60 text-left font-medium text-[#1D4ED8]">${h}</th>`)
        .join('')}</tr></thead><tbody>${rows
        .map((row) => {
          const cells = row.split('|').filter(Boolean).map((c) => c.trim());
          return `<tr>${cells.map((c) => `<td class="px-2 py-1.5 border border-[#BFDBFE]/60">${c}</td>`).join('')}</tr>`;
        })
        .join('')}</tbody></table>`;
    }
  }

  return (
    <div className="relative group">
      {beforeTable && (
        <div
          className="text-[15px] leading-[1.5] whitespace-pre-wrap text-[#0F172A]"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(beforeTable) }}
        />
      )}
      {tableHtml && (
        <div className="overflow-x-auto" dangerouslySetInnerHTML={{ __html: tableHtml }} />
      )}
      {afterTable && (
        <div
          className="text-[15px] leading-[1.5] whitespace-pre-wrap text-[#0F172A]"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(afterTable) }}
        />
      )}
      {onSpeak && (
        <button
          onClick={() => onSpeak(content)}
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          title="朗读"
          style={{
            background: 'rgba(255,255,255,0.70)',
            border: '1px solid rgba(255,255,255,0.80)',
          }}
        >
          <svg className="w-3 h-3 text-[#3B82F6]" fill="currentColor" viewBox="0 0 24 24">
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
      case 'progress-list':
        return <ProgressListCard data={message.data as Record<string, unknown>} />;
      case 'agent-report':
        return <AgentReportCard data={message.data as Record<string, unknown>} />;
      case 'ai-call':
        return <AICallCard data={message.data as Record<string, unknown>} />;
      case 'data-capture':
        return <DataCaptureCard data={message.data as Record<string, unknown>} />;
      case 'risk-radar':
        return <RiskRadarCard data={message.data as Record<string, unknown>} />;
      case 'root-cause':
        return <RootCauseCard data={message.data as Record<string, unknown>} />;
      case 'meeting-target':
        return <MeetingTargetCard data={message.data as Record<string, unknown>} />;
      case 'meeting-script':
        return <MeetingScriptCard data={message.data as Record<string, unknown>} />;
      case 'response-strategy':
        return <ResponseStrategyCard data={message.data as Record<string, unknown>} />;
      case 'recording':
        return <RecordingCard data={message.data as Record<string, unknown>} />;
      case 'meeting-result':
        return <MeetingResultCard data={message.data as Record<string, unknown>} />;
      case 'plan-delivery':
        return <PlanDeliveryCard data={message.data as Record<string, unknown>} />;
      case 'report-upload':
        return <ReportUploadCard data={message.data as Record<string, unknown>} />;
      case 'report-preview':
        return <ReportPreviewCard data={message.data as Record<string, unknown>} />;
      case 'material-config':
        return <MaterialConfigCard data={message.data as Record<string, unknown>} />;
      case 'material-preview':
        return <MaterialPreviewCard data={message.data as Record<string, unknown>} />;
      case 'material-distribute':
        return <MaterialDistributeCard data={message.data as Record<string, unknown>} />;
      case 'case-search':
        return <CaseSearchCard data={message.data as Record<string, unknown>} />;
      case 'case-result':
        return <CaseResultCard data={message.data as Record<string, unknown>} />;
      case 'case-interview':
        return <CaseInterviewCard data={message.data as Record<string, unknown>} />;
      case 'case-video':
        return <CaseVideoCard data={message.data as Record<string, unknown>} />;
      case 'field-moments-post':
        return <FieldMomentsPostCard data={message.data as Record<string, unknown>} />;
      case 'field-ai-analysis':
        return <FieldAIAnalysisCard data={message.data as Record<string, unknown>} />;
      case 'field-reply-preview':
        return <FieldReplyPreviewCard data={message.data as Record<string, unknown>} />;
      case 'field-customer-profile':
        return <FieldCustomerProfileCard data={message.data as Record<string, unknown>} />;
      case 'field-needs-analysis':
        return <FieldNeedsAnalysisCard data={message.data as Record<string, unknown>} />;
      case 'field-sales-script':
        return <FieldSalesScriptCard data={message.data as Record<string, unknown>} />;
      case 'field-gap-diagnosis':
        return <FieldGapDiagnosisCard data={message.data as Record<string, unknown>} />;
      case 'field-product-plans':
        return <FieldProductPlansCard data={message.data as Record<string, unknown>} />;
      case 'field-commission':
        return <FieldCommissionCard data={message.data as Record<string, unknown>} />;
      case 'field-materials':
        return <FieldMaterialsCard data={message.data as Record<string, unknown>} />;
      default:
        return <TextContent content={message.content} onSpeak={isAi ? onSpeak : undefined} />;
    }
  };

  if (!isAi) {
    return (
      <div className="flex justify-end mb-3 animate-fade-in-up" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
        <div
          className="max-w-[82%] px-4 py-2.5 rounded-[18px] rounded-tr-[6px] text-white"
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #4F46E5 100%)',
            boxShadow: '0 4px 16px rgba(79,70,229,0.3)',
          }}
        >
          <p className="text-[14px] leading-[1.6]">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 animate-slide-in-left" style={{ paddingLeft: '12px', paddingRight: '16px' }}>
      {message.type === 'text' ? (
        <div className="flex items-start gap-2">
          {/* AI avatar */}
          <div style={{
            width: 28, height: 28, borderRadius: 9, flexShrink: 0, marginTop: 2,
            background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="9" r="3.5" fill="white" />
              <path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
          <div
            className="max-w-[82%] rounded-[16px] rounded-tl-[6px] px-4 py-3"
            style={{
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 2px 12px rgba(99,102,241,0.08), 0 1px 0 rgba(255,255,255,0.9) inset',
              border: '1px solid rgba(99,102,241,0.08)',
            }}
          >
            {renderContent()}
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <div style={{
            width: 28, height: 28, borderRadius: 9, flexShrink: 0, marginTop: 2,
            background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="9" r="3.5" fill="white" />
              <path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="max-w-[90%] flex flex-col gap-3">
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
}
