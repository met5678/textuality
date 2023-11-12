import React from 'react';

import './GlitchOverlay.css';

const GlitchOverlay = ({ event }: { event: Partial<Event> }) => {
  return (
    <div
      className="glitchOverlay"
      style={{ backgroundImage: "url('/casino/hacker/glitch.png')" }}
    />
  );
};

export default GlitchOverlay;
