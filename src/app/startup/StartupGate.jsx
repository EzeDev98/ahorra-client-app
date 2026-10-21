import { useEffect, useRef, useState } from "react";
import { run } from "@core/motion/motion.js";
import LoadingScreen from "@shared/components/feedback/LoadingScreen.jsx";
import { ROUTES } from "@app/router/routes.js";
import { detectInstalledApp } from "@core/pwa/isPWAInstalled.js";
import { decideRoute } from "./decideRoute.js";

const MIN_VISIBLE_MS = 3000;
const FONT_WAIT_MS = 1500;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function untilReady() {
  await Promise.race([document.fonts?.ready, sleep(FONT_WAIT_MS)]);
  await sleep(
    MIN_VISIBLE_MS - (performance.now() - (window.__loadingShownAt ?? 0)),
  );
}

export default function StartupGate({ children }) {
  const [phase, setPhase] = useState("loading"); 
  const screen = useRef(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      untilReady(),
      detectInstalledApp()
        .then(() => decideRoute({ launching: true }))
        .catch(() => null),
    ]).then(([, destination]) => {
      if (cancelled) return;
      if (destination && window.location.pathname === ROUTES.onboarding) {
        window.history.replaceState(window.history.state, "", destination);
      }
      setPhase("revealing");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (phase !== "revealing") return undefined;
    let cancelled = false;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if (!screen.current) return;
        run(screen.current, [{ opacity: 1 }, { opacity: 0 }], {
          duration: "reveal",
          ease: "standard",
          fill: "forwards",
        }).then(() => {
          if (!cancelled) setPhase("done");
        });
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [phase]);

  return (
    <>
      {phase !== "loading" && children}
      {phase !== "done" && (
        <LoadingScreen ref={screen} leaving={phase === "revealing"} />
      )}
    </>
  );
}
