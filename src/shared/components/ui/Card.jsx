import './Card.css';
import { cx } from '@shared/utils/classNames.js';

export default function Card({ as: Tag = 'div', className, children, ...rest }) {
  return (
    <Tag className={cx('ui-card', className)} {...rest}>
      {children}
    </Tag>
  );
}
