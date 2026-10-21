import { Link } from 'react-router';
import './TextLink.css';
import { cx } from '@shared/utils/classNames.js';

// Pass `to` for an in-app route (needs a Router above it) or `href` for an external address.
// Actions that are not navigation (Resend code, Later) are a ghost Button, not a link.
export default function TextLink({ to, href, className, children, ...rest }) {
  const classes = cx('ui-link', className);

  if (to !== undefined) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  );
}
