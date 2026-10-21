import { useLayoutEffect, useRef } from 'react';
import useNetwork from '@shared/hooks/useNetwork.js';
import usePresence from '@shared/hooks/usePresence.js';
import ConnectionRequired from './ConnectionRequired.jsx';


export default function NetworkGate({ children }) {
  const { online } = useNetwork();
  const { mounted, visible } = usePresence(!online);
  const app = useRef(null);

  useLayoutEffect(() => {
    const root = app.current?.closest('body > *');
    if (online || !root) return undefined;

    const previous = document.activeElement;
    const outside = [...document.body.children].filter((element) => element !== root && !element.inert);
    outside.forEach((element) => {
      element.inert = true;
    });

    return () => {
      outside.forEach((element) => {
        element.inert = false;
      });
      if (previous instanceof HTMLElement && previous !== document.body && document.contains(previous)) {
        previous.focus({ preventScroll: true });
      }
    };
  }, [online]);

  return (
    <>
      <div ref={app} inert={!online}>
        {children}
      </div>
      {mounted && <ConnectionRequired visible={visible} />}
    </>
  );
}
