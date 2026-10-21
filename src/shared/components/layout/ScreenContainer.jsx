import './ScreenContainer.css';
import { cx } from '@shared/utils/classNames.js';

export default function ScreenContainer({ as: Tag = 'main', className, children, ...rest }) {
  return (
    <Tag className={cx('ui-screen', className)} {...rest}>
      <div className="ui-screen__inner">{children}</div>
    </Tag>
  );
}
