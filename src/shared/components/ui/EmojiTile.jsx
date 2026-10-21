import './EmojiTile.css';
import { cx } from '@shared/utils/classNames.js';

// A small tinted square holding one emoji. Decorative: the text beside it carries the meaning, so it is hidden from
// screen readers. size: 'md' (40px) | 'sm' (32px).
export default function EmojiTile({ emoji, size = 'md', className }) {
  return (
    <span className={cx('ui-emoji-tile', `ui-emoji-tile--${size}`, className)} aria-hidden="true">
      {emoji}
    </span>
  );
}
