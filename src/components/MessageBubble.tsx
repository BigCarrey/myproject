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
import { FieldCustomerPlanCard } from './cards/FieldCustomerPlanCard';
import { FieldInvitationCard } from './cards/FieldInvitationCard';
import { FieldCustomerArchiveCard } from './cards/FieldCustomerArchiveCard';
import { FieldInsuranceSolutionCard } from './cards/FieldInsuranceSolutionCard';
import { FieldSalesLogicCard } from './cards/FieldSalesLogicCard';
import FieldMonthlyPlanCard from './cards/FieldMonthlyPlanCard';
import FieldOutreachScriptsCard from './cards/FieldOutreachScriptsCard';
import FieldInteractionHeatCard from './cards/FieldInteractionHeatCard';
import FieldSmartRecommendCard from './cards/FieldSmartRecommendCard';
import FieldCustomerPanoramaCard from './cards/FieldCustomerPanoramaCard';
import FieldRoleplayCustomerCard from './cards/FieldRoleplayCustomerCard';
import FieldHealthConsultCard from './cards/FieldHealthConsultCard';
import FieldVisitPrepCard from './cards/FieldVisitPrepCard';
import FieldVisitPlanCard from './cards/FieldVisitPlanCard';

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

function WeChatScreenshotPreview({ data }: { data?: Record<string, unknown> }) {
  const contactName = (data?.contactName as string) || '客户';
  const msgs = (data?.messages as Array<{ type: 'self' | 'contact'; text: string }>) || [];
  return (
    <div style={{ width: 195, borderRadius: 10, overflow: 'hidden', boxShadow: '0 3px 14px rgba(0,0,0,0.35)', border: '0.5px solid rgba(0,0,0,0.12)' }}>
      {/* 状态栏 */}
      <div style={{ background: '#e9e9e9', padding: '3px 8px', display: 'flex', justifyContent: 'space-between', fontSize: 8, color: '#555' }}>
        <span>21:15</span>
        <span>●●● WiFi 🔋</span>
      </div>
      {/* 聊天标题栏 */}
      <div style={{ background: '#ededed', padding: '5px 10px', display: 'flex', alignItems: 'center', borderBottom: '0.5px solid #ccc' }}>
        <span style={{ fontSize: 14, color: '#555', marginRight: 4 }}>‹</span>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 12, fontWeight: 500, color: '#1a1a1a' }}>{contactName}</span>
        <span style={{ fontSize: 14, color: '#555' }}>⋯</span>
      </div>
      {/* 聊天消息区 */}
      <div style={{ background: '#f0f0f0', padding: '8px 7px', display: 'flex', flexDirection: 'column', gap: 6, minHeight: 60 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.type === 'self' ? 'flex-end' : 'flex-start', alignItems: 'flex-start', gap: 4 }}>
            {m.type === 'contact' && (
              <div style={{ width: 22, height: 22, borderRadius: 4, background: '#4B7BE5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                {contactName.charAt(0)}
              </div>
            )}
            <div style={{ background: m.type === 'self' ? '#95EC69' : '#fff', borderRadius: 5, padding: '4px 7px', fontSize: 9.5, maxWidth: 135, color: '#000', lineHeight: 1.4, wordBreak: 'break-all' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      {/* 底部标签 */}
      <div style={{ background: '#ededed', padding: '3px 8px', fontSize: 9, color: '#888', textAlign: 'center' }}>
        截图 · 微信对话
      </div>
    </div>
  );
}

export function MessageBubble({ message, onSpeak }: MessageBubbleProps) {
  const isAi = message.role === 'ai';

  // 空内容的 text 消息只用于触发 wechatEvents，不渲染气泡
  if (isAi && message.type === 'text' && !message.content) return null;

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
      case 'field-customer-plan':
        return <FieldCustomerPlanCard data={message.data as Record<string, unknown>} />;
      case 'field-invitation':
        return <FieldInvitationCard data={message.data as Record<string, unknown>} />;
      case 'field-customer-archive':
        return <FieldCustomerArchiveCard data={message.data as Record<string, unknown>} />;
      case 'field-insurance-solution':
        return <FieldInsuranceSolutionCard data={message.data as Record<string, unknown>} />;
      case 'field-sales-logic':
        return <FieldSalesLogicCard data={message.data as Record<string, unknown>} />;
      case 'field-monthly-plan':
        return <FieldMonthlyPlanCard data={message.data as any} />;
      case 'field-health-consult':
        return <FieldHealthConsultCard data={message.data as any} />;
      case 'field-visit-prep':
        return <FieldVisitPrepCard data={message.data as any} />;
      case 'field-visit-plan':
        return <FieldVisitPlanCard data={message.data as Record<string, unknown>} />;
      case 'field-outreach-scripts':
        return <FieldOutreachScriptsCard data={message.data as any} />;
      case 'field-interaction-heat':
        return <FieldInteractionHeatCard data={message.data as any} />;
      case 'field-smart-recommend':
        return <FieldSmartRecommendCard data={message.data as any} />;
      case 'field-customer-panorama':
        return <FieldCustomerPanoramaCard data={message.data as any} />;
      case 'field-roleplay-customer':
        return <FieldRoleplayCustomerCard data={message.data as any} />;
      default:
        return <TextContent content={message.content} onSpeak={isAi ? onSpeak : undefined} />;
    }
  };

  if (!isAi) {
    if (message.type === 'wechat-screenshot') {
      return (
        <div className="flex justify-end mb-3 animate-fade-in-up" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
          <WeChatScreenshotPreview data={message.data} />
        </div>
      );
    }
    return (
      <div className="flex justify-end mb-3 animate-fade-in-up" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
        <div
          className="max-w-[85%] px-4 py-2.5 rounded-[18px] text-white"
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
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
        <div
          className="max-w-[85%] rounded-[18px] px-4 py-3"
          style={{
            background: 'rgba(255,255,255,0.70)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 8px 30px 0 rgba(37,99,235,0.06)',
            border: '1px solid rgba(255,255,255,0.80)',
          }}
        >
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
