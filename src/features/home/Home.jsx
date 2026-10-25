import "./Home.css";
import Composer from "./Composer.jsx";
import PendingStack from "./PendingStack.jsx";
import usePendingEntries from "./usePendingEntries.js";

export default function Home() {
  const { entries, loadFailed, retrying, retry } = usePendingEntries();
  return (
    <div className="home">
      <main className="home__stage">
        <Composer />
        <PendingStack
          entries={entries}
          loadFailed={loadFailed}
          retrying={retrying}
          onRetry={retry}
        />
      </main>
    </div>
  );
}
