import { ArrowLeft } from 'lucide-react';
import './FormScreen.css';
import ScreenContainer from './ScreenContainer.jsx';
import IconButton from '@shared/components/ui/IconButton.jsx';
import { cx } from '@shared/utils/classNames.js';

export default function FormScreen({
  title,
  description,
  step,
  hero,
  onBack,
  backLabel = 'Back',
  onSubmit,
  footer,
  className,
  children,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(event);
  };

  const body = (
    <>
      <div className="ui-form-screen__fields">{children}</div>
      {footer && <div className="ui-form-screen__footer">{footer}</div>}
    </>
  );

  return (
    <ScreenContainer className={cx('ui-form-screen', className)}>
      <div className="ui-screen__bar">
        {onBack && <IconButton icon={ArrowLeft} label={backLabel} className="ui-form-screen__back" onClick={onBack} />}
      </div>
      <div className="ui-screen__group">
        {hero}
        {step}
        <header className="ui-form-screen__head">
          <h1 className="ui-form-screen__title">{title}</h1>
          {description && <p className="ui-form-screen__description">{description}</p>}
        </header>
        {onSubmit ? (
          <form className="ui-form-screen__body" noValidate onSubmit={handleSubmit}>
            {body}
          </form>
        ) : (
          <div className="ui-form-screen__body">{body}</div>
        )}
      </div>
    </ScreenContainer>
  );
}
