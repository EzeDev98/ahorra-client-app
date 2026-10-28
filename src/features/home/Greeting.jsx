export default function Greeting({ title, subtitle }) {
  return (
    <div className="home__greeting">
      <p className="home__greeting-title">{title}</p>
      <p className="home__greeting-sub">{subtitle}</p>
    </div>
  );
}
