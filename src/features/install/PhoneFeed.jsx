import './Install.css';
import { PHONE_EMOJI } from './installContent.js';

export default function PhoneFeed() {
  return (
    <div className="install__feed" aria-hidden="true">
      <svg className="install__feed-arrow" viewBox="40 40 120 120">
        <polygon points="48,48 152,100 48,152 82,100" />
      </svg>
      <span className="install__feed-phone">{PHONE_EMOJI}</span>
    </div>
  );
}
