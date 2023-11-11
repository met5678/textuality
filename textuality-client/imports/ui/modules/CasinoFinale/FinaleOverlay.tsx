import React, { ReactNode } from 'react';
import { Event } from '/imports/schemas/event';
import './FinaleOverlay.css';

const FinaleOverlay = ({ event }: { event: Event }) => {
  const { state, finale_data } = event;
  //const { phase } = finale_data;
  //if (state !== 'finale') return null;
  const phase = 'total-money';
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
    end: '/casino/videos/hackerwin-1.mp4',
  };

  const titleSpans = (title: string) => {
    return title.split('').map((letter, index) => (
      <span
        key={index}
        className={index % 2 === 0 ? 'evenLetter' : 'oddLetter'}
      >
        {letter}
      </span>
    ));
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
          <div className="finale-money-stolen">
            <h2>{titleSpans('Total Money Stolen')}</h2>
            <p>{finale_data.totalMoney} BB</p>
          </div>
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
      {phase === 'most-checkpoints' && (
        <div className="finale-split-video-right">
          <div className="finale-player">
            {finale_data.player.alias}
            {finale_data.player.checkpoints}
            {finale_data.player.avatar}
          </div>
          <video src="/casino/videos/morgan.mp4" autoPlay muted />
        </div>
      )}
      {phase === 'emily-cat' && (
        <div className="finale-split-video-right">
          <div className="finale-text">
            You helped Ramona foster a cat in need!
          </div>
          <video src="/casino/videos/emily.mp4" autoPlay muted />
        </div>
      )}
      {phase === 'most-slot-spins' && (
        <div className="finale-split-video-right">
          <div className="finale-player">
            {finale_data.player.alias}
            {finale_data.player.slot_spins}
            {finale_data.player.avatar}
          </div>
          <video src="/casino/videos/shady.mp4" autoPlay muted />
        </div>
      )}{' '}
      {phase === 'most-popular-slot' && (
        <div className="finale-split-video-right">
          <div className="finale-player">
            {finale_data.slotMachine.name}
            {finale_data.slotMachine.spins}
          </div>
          <video src="/casino/videos/liz.mp4" autoPlay muted />
        </div>
      )}{' '}
      {phase === 'end' && (
        <div className="finale-split-video-right">
          <div className="finale-text">
            Now put down your phones and enjoy the rest of the party!
          </div>
          <video src="/casino/videos/jackie.mp4" autoPlay muted />
        </div>
      )}{' '}
    </div>
  );
};
export default FinaleOverlay;
