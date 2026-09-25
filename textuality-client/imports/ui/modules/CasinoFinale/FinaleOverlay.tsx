import React from 'react';
import { Event } from '/imports/schemas/event';
import './FinaleOverlay.css';
import RouletteChip from '../Roulette/RouletteChip';
import FlashyText from '../../themes/casino/FlashyText/FlashyText';
import { themes, Theme } from '../../themes/casino/CasinoThemeConfig';
import commaNumber from 'comma-number';

const FinaleOverlay = ({ event }: { event: Event }) => {
  const { finale_data, skin } = event;
  const { phase } = finale_data;

  console.log(finale_data);

  const theme = themes[skin as Theme];
  const currency = theme.currency;

  const phaseTitle = (title: string) => {
    return (
      <h2>
        <FlashyText text={title} />
      </h2>
    );
  };

  const phasePlayerChip = (datum: string) => {
    return (
      <>
        <RouletteChip
          width={250}
          height={250}
          avatar_id={finale_data.player.avatar}
        />
        <div className="finale-player-name">{finale_data.player.alias}</div>
        <div className="finale-player-datum">{datum}</div>
      </>
    );
  };

  const renderPhase = () => {
    switch (phase) {
      case 'pre':
        return (
          <>
            <div className="glitch-fullscreen" />
            <audio src="/casino/sounds/glitch.ogg" autoPlay />
          </>
        );

      case 'hacker-appears':
        return (
          <div className="video-fullscreen">
            <video src="/casino/videos/jackie-moneybags.mp4" autoPlay muted />
          </div>
        );

      case 'total-money':
        return (
          <div className="finale-split finale-split-video-left">
            {event.skin === 'normal' && (
              <video src="/casino/videos/jon.mp4" autoPlay muted />
            )}
            <div className="finale-money-stolen">
              {phaseTitle('Total VC Won')}
              <div className="finale-player-datum">
                {commaNumber(finale_data.totalMoney)} {currency}
              </div>
            </div>
          </div>
        );

      case 'most-money':
        return (
          <div className="finale-split finale-split-video-left">
            <div className="finale-player">
              {phaseTitle('Biggest Winner')}
              {phasePlayerChip(
                `${commaNumber(finale_data.player.money)} ${currency}`,
              )}
            </div>
            {event.skin === 'space' && (
              <video
                src="/casino/space/videos/shady-finale-1.mp4"
                autoPlay
                muted
              />
            )}
            {event.skin === 'normal' && (
              <video src="/casino/videos/gray.mp4" autoPlay muted />
            )}
          </div>
        );

      case 'most-checkpoints':
        return (
          <div className="finale-split finale-split-video-left">
            <div className="finale-player">
              {phaseTitle('Hashtag Finder')}
              {phasePlayerChip(
                `${finale_data.player.checkpoints} hashtags found!`,
              )}
            </div>
            {event.skin === 'space' && (
              <video
                src="/casino/space/videos/liz-finale-2.mp4"
                autoPlay
                muted
              />
            )}
            {event.skin === 'normal' && (
              <video src="/casino/videos/morgan.mp4" autoPlay muted />
            )}
          </div>
        );

      case 'most-slot-spins':
        return (
          <div className="finale-split finale-split-video-left">
            <div className="finale-player">
              {phaseTitle('Slot Spinner')}
              {phasePlayerChip(`${finale_data.player.slot_spins} spins!`)}
            </div>
            {event.skin === 'space' && (
              <video
                src="/casino/space/videos/shady-finale-2.mp4"
                autoPlay
                muted
              />
            )}
            {event.skin === 'normal' && (
              <video src="/casino/videos/shady.mp4" autoPlay muted />
            )}
          </div>
        );

      case 'most-popular-slot':
        return (
          <div className="finale-split finale-split-video-left">
            <div className="finale-player">
              {phaseTitle('Most Popular Slot')}
              <div className="finale-player-name">
                {finale_data.slotMachine.name}
              </div>
              <div className="finale-player-datum">
                {finale_data.slotMachine.spins} spins!
              </div>
            </div>

            <video src="/casino/videos/liz.mp4" autoPlay muted />
          </div>
        );

      case 'end':
        return (
          <div className="finale-split finale-split-video-left">
            <div className="finale-text">
              Now put down your phones and enjoy the rest of the night!
            </div>
            <video src="/casino/videos/jackie.mp4" autoPlay muted />
          </div>
        );
    }
  };

  return (
    <div className={`finale-overlay ${phase} ${skin}`}>{renderPhase()}</div>
  );
};
export default FinaleOverlay;
