import React, { ReactNode } from 'react';
import { Event } from '/imports/schemas/event';
import './FinaleOverlay.css';

const FinaleOverlay = ({ event }: { event: Event }) => {
  const { state, finale_data } = event;
  const { phase } = finale_data;
  if (state !== 'finale') return null;

  console.log(finale_data);

  const videosForPhases: Record<string, string> = {
    pre: '',
    'hacker-appears': '/casino/videos/jackie-moneybags.mp4',
    'total-money': '/casino/videos/jon.mp4',
    'most-money': '/casino/videos/gray.mp4',
    'most-checkpoints': '/casino/videos/morgan.mp4',
    'emily-cat': '/casino/videos/emily.mp4',
    'most-slot-spins': '/casino/videos/shady.mp4',
    'most-popular-slot': '/casino/videos/liz.mp4',
    end: '/casino/videos/jackie.mp4',
  };

  return (
    <div className={`finale-overlay ${phase}`}>
      {phase === 'pre' && <div></div>}
      {phase === 'hacker-appears' && (
        <div className="video-fullscreen">
          <video src="/casino/videos/jackie-moneybags.mp4" autoPlay muted />
        </div>
      )}
      {phase === 'total-money' && (
        <div className="finale-split-video-left">
          <video src="/casino/videos/jon.mp4" autoPlay muted />
          <div className="finale-money-stolen">{finale_data.totalMoney} BB</div>
        </div>
      )}
      {phase === 'most-money' && (
        <div className="finale-split-video-right">
          <div className="finale-player">
            {finale_data.player.alias}
            {finale_data.player.money}
            {finale_data.player.avatar}
          </div>
          <video src="/casino/videos/gray.mp4" autoPlay muted />
        </div>
      )}
    </div>
  );
};
export default FinaleOverlay;
