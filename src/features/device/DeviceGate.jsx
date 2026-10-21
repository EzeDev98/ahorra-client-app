import { useState } from 'react';
import { getDeviceSupport } from './deviceSupport.js';
import DeviceNotSupported from './DeviceNotSupported.jsx';

export default function DeviceGate({ children }) {
  const [support] = useState(getDeviceSupport);
  if (support.supported) return children;
  return <DeviceNotSupported reason={support.reason} desktop={support.desktop} />;
}
