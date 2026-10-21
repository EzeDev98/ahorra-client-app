import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import './Overlay.css';
import IconButton from './IconButton.jsx';
import usePresence from '@shared/hooks/usePresence.js';
import useOverlayBehavior from '@shared/hooks/useOverlayBehavior.js';
import { cx } from '@shared/utils/classNames.js';

function OverlayView({ open, visible, variant, title, label, footer, dismissible, onClose, className, children }) {
  const panelRef = useRef(null);
  const titleId = useId();

  useOverlayBehavior({ active: open, containerRef: panelRef, onClose: dismissible ? onClose : undefined });

  return (
    <div className={cx('ui-overlay', `ui-overlay--${variant}`)} data-visible={visible}>
      <div className="ui-overlay__scrim" onClick={dismissible ? onClose : undefined} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : label}
        tabIndex={-1}
        className={cx('ui-overlay__panel', className)}
      >
        {(title || dismissible) && (
          <header className="ui-overlay__head">
            {title && (
              <h2 id={titleId} className="ui-overlay__title">
                {title}
              </h2>
            )}
            {dismissible && (
              <IconButton icon={X} label="Close" className="ui-overlay__close" onClick={onClose} />
            )}
          </header>
        )}
        <div className="ui-overlay__body">{children}</div>
        {footer && <footer className="ui-overlay__foot">{footer}</footer>}
      </div>
    </div>
  );
}

// Internal. variant: 'modal' | 'sheet' | 'drawer'.
// title labels the dialog; without one, pass label. dismissible: false removes the close button and
// turns off Escape and scrim-tap, for choices the person must make.
export default function Overlay({ open, ...props }) {
  const { mounted, visible } = usePresence(open);
  if (!mounted) return null;
  return createPortal(<OverlayView open={open} visible={visible} dismissible {...props} />, document.body);
}
