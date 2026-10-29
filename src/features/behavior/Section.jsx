export default function Section({ heading, children }) {
  return (
    <section>
      <h2 className="behavior__heading">{heading}</h2>
      {children}
    </section>
  );
}
