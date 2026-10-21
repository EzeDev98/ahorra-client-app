import Choice from './Choice.jsx';

// Give every radio in a group the same `name`. Native props: checked, onChange(event), value, disabled.
export default function Radio(props) {
  return <Choice type="radio" {...props} />;
}
