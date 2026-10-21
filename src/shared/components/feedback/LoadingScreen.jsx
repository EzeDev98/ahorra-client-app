import { useState } from 'react';
import './LoadingScreen.css';
import { cx } from '@shared/utils/classNames.js';
import { DOT_CYCLE_MS, LOADING_COPY } from './loadingContent.js';

export default function LoadingScreen({ ref, leaving = false, page = false }) {

  const [phase] = useState(() => `${-(performance.now() % DOT_CYCLE_MS)}ms`);
  return (
    <div
      ref={ref}
      className={cx('loading-screen', page && 'loading-screen--page')}
      role="status"
      aria-label={LOADING_COPY.label}
      aria-hidden={leaving || undefined}
      style={{ '--loader-phase': phase }}
    >
      <img className="loading-screen__logo" src="/logo-mark.png" alt="" width="512" height="512" />
      <p className="loading-screen__tagline">{LOADING_COPY.tagline}</p>
      <span className="loading-screen__dots" aria-hidden="true">
        <span className="loading-screen__dot" />
        <span className="loading-screen__dot" />
        <span className="loading-screen__dot" />
      </span>
    </div>
  );
}
