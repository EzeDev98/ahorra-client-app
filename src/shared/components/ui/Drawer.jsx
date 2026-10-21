import Overlay from './Overlay.jsx';

// The side panel. It slides over the screen without a route change, so the page underneath stays mounted.
// Same props as Modal; label defaults to "Menu". Put the sections (Today, navigation) in children
// and Sign out in footer. Body and footer padding are the caller's, so sections can run edge to edge.
export default function Drawer({ label = 'Menu', ...props }) {
  return <Overlay variant="drawer" label={label} {...props} />;
}
