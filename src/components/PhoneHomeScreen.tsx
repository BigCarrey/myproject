import type { PhoneNotification, CalendarEvent } from '../types';

interface PhoneHomeScreenProps {
  notification: PhoneNotification | null;
  calendarEvents: CalendarEvent[];
  isRecording: boolean;
  recordingDuration: number;
  onOpenApp: (app: string) => void;
  onDismissNotification: () => void;
}

const apps = [
  { id: 'wechat-chat', name: '微信', icon: '💬', color: '#07C160' },
  { id: 'calendar', name: '日历', icon: '📅', color: '#FF3B30' },
  { id: 'recorder', name: '录音', icon: '🎙️', color: '#FF2D55' },
  { id: 'memo', name: '备忘录', icon: '📝', color: '#FFCC00' },
  { id: 'camera', name: '相机', icon: '📷', color: '#8E8E93' },
  { id: 'photos', name: '照片', icon: '🖼️', color: '#FF9500' },
];

const dockApps = [
  { id: 'phone', name: '电话', icon: '📞', color: '#34C759' },
  { id: 'sms', name: '短信', icon: '💌', color: '#34C759' },
];

function formatRecordingTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function PhoneHomeScreen({
  notification,
  calendarEvents,
  isRecording,
  recordingDuration,
  onOpenApp,
  onDismissNotification,
}: PhoneHomeScreenProps) {
  return (
    <div className="phone-home-screen">
      {/* Status bar */}
      <div className="phone-home-status-bar">
        <span className="phone-home-time">
          {new Date().getHours().toString().padStart(2, '0')}:
          {new Date().getMinutes().toString().padStart(2, '0')}
        </span>
        <div className="phone-home-status-icons">
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div className="phone-home-recording-bar">
          <span className="phone-home-recording-dot" />
          <span>录音中</span>
          <span className="phone-home-recording-time">{formatRecordingTime(recordingDuration)}</span>
        </div>
      )}

      {/* Notification banner */}
      {notification && (
        <div className="phone-home-notification" onClick={onDismissNotification}>
          <div className="phone-home-notification-header">
            <span className="phone-home-notification-icon">{notification.icon}</span>
            <span className="phone-home-notification-app">{notification.app}</span>
            <span className="phone-home-notification-time">{notification.timestamp}</span>
          </div>
          <div className="phone-home-notification-title">{notification.title}</div>
          <div className="phone-home-notification-body">{notification.body}</div>
        </div>
      )}

      {/* Calendar widget (if events exist) */}
      {calendarEvents.length > 0 && (
        <div className="phone-home-calendar-widget">
          <div className="phone-home-widget-title">📅 日历</div>
          {calendarEvents.map((evt, i) => (
            <div key={i} className="phone-home-calendar-event">
              <div
                className="phone-home-calendar-dot"
                style={{ background: evt.color || '#3B82F6' }}
              />
              <div className="phone-home-calendar-info">
                <div className="phone-home-calendar-event-title">{evt.title}</div>
                <div className="phone-home-calendar-event-time">{evt.date} {evt.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* App grid */}
      <div className="phone-home-app-grid">
        {apps.map((app) => (
          <button
            key={app.id}
            className="phone-home-app"
            onClick={() => onOpenApp(app.id)}
          >
            <div className="phone-home-app-icon" style={{ background: app.color }}>
              <span>{app.icon}</span>
              {app.id === 'wechat-chat' && notification && notification.app === '微信' && (
                <span className="phone-home-app-badge">1</span>
              )}
              {app.id === 'recorder' && isRecording && (
                <span className="phone-home-app-recording-dot" />
              )}
            </div>
            <span className="phone-home-app-name">{app.name}</span>
          </button>
        ))}
      </div>

      {/* Dock */}
      <div className="phone-home-dock">
        {dockApps.map((app) => (
          <button key={app.id} className="phone-home-dock-app" onClick={() => onOpenApp(app.id)}>
            <div className="phone-home-dock-icon" style={{ background: app.color }}>
              <span>{app.icon}</span>
            </div>
            <span className="phone-home-dock-name">{app.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
