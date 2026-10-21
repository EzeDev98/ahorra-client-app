import Overlay from './Overlay.jsx';

// Centred dialog for confirmations. Props: open, onClose, title, footer (a row of Buttons),
// dismissible (default true), label (when there is no title). Children are the body.
// Put data-autofocus on the element that should take focus first (a TextField, say).
export default function Modal(props) {
  return <Overlay variant="modal" {...props} />;
}
