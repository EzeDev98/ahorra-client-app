import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import './InfoBanner.css';
import EmojiTile from './EmojiTile.jsx';
import { cx } from '@shared/utils/classNames.js';

const ICONS = { info: Info, success: CircleCheck, warning: TriangleAlert, error: CircleAlert };

// tone: 'info' | 'success' | 'warning' | 'error'. The icon carries the tone, so colour is never the only signal.
// emoji is optional: when given it replaces the line icon with a small emoji tile (Install). title is optional. action is a slot for a small Button. Errors are announced immediately (role="alert").
export default function InfoBanner({ tone = 'info', emoji, title, action, className, children }) {
  const Icon = ICONS[tone];

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cx('ui-banner', `ui-banner--${tone}`, className)}
    >
      {emoji ? <EmojiTile emoji={emoji} size="sm" /> : <Icon className="ui-banner__icon" aria-hidden="true" />}
      <div className="ui-banner__text">
        {title && <p className="ui-banner__title">{title}</p>}
        {children && <div className="ui-banner__body">{children}</div>}
      </div>
      {action && <div className="ui-banner__action">{action}</div>}
    </div>
  );
}
