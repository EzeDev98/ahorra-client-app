import Choice from './Choice.jsx';

// Native props: checked, onChange(event), name, disabled. Also label and hint.
export default function Checkbox(props) {
  return <Choice type="checkbox" {...props} />;
}
