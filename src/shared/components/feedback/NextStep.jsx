
import { Hammer } from 'lucide-react';
import './NextStep.css';

// Placeholder for any screen or link we have not built yet.
export default function NextStep({
  title = 'Coming next',
  description = 'This screen is built in an upcoming episode.',
}) {
  return (
    <main className="next-step">
      <span className="next-step__logo">Ahorra</span>
      <Hammer className="next-step__icon" aria-hidden="true" />
      <p className="next-step__title">{title}</p>
      <p className="next-step__description">{description}</p>
    </main>
  );
}
