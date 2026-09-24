import React from 'react';
import { Event } from '/imports/schemas/event';
import './FinaleOverlay.css';
import RouletteChip from '../Roulette/RouletteChip';
import FlashyText from '../../themes/casino/FlashyText/FlashyText';
import { themes, Theme } from '../../themes/casino/CasinoThemeConfig';
import commaNumber from 'comma-number';

const FinaleOverlay = ({ event }: { event: Event }) => {
  const { state, finale_data, skin } = event;
  const { phase } = finale_data;

  console.log(finale_data);

  const theme = themes[skin as Theme];
  const currency = theme.currency;

  return (
    <div className={`finale-overlay ${phase} ${skin}`}>
      {phase === 'pre' && (
        <>
          <div className="glitch-fullscreen" />
          <audio src="/casino/sounds/glitch.ogg" autoPlay />
        </>
      )}
      {phase === 'hacker-appears' && (
        <div className="video-fullscreen">
          <video src="/casino/videos/jackie-moneybags.mp4" autoPlay muted />
        </div>
      )}
      {phase === 'total-money' && (
        <div className="finale-split">
          {/* {event.skin === 'space' && (
            <video src="/casino/space/videos/liz-finale-1.mp4" autoPlay muted />
          )} */}
          {event.skin === 'normal' && (
            <video src="/casino/videos/jon.mp4" autoPlay muted />
          )}
          <div className="finale-money-stolen">
            <h2>
              <FlashyText text="Total VC Won:" />
            </h2>
            <div className="finale-player-datum">
              {commaNumber(finale_data.totalMoney)} {currency}
            </div>
          </div>
        </div>
      )}
      {phase === 'most-money' && (
        <div className="finale-split finale-split-video-left">
          <div className="finale-player">
            <h2>
              <FlashyText text="Biggest Winner" />
            </h2>
            <RouletteChip
              width={250}
              height={250}
              avatar_id={finale_data.player.avatar}
            />
            <div className="finale-player-name">{finale_data.player.alias}</div>
            <div className="finale-player-datum">
              {commaNumber(finale_data.player.money)} {currency}
            </div>
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
      )}
      {phase === 'most-checkpoints' && (
        <div className="finale-split finale-split-video-left">
          <div className="finale-player">
            <h2>
              <FlashyText text="Hashtag Finder" />
            </h2>
            <RouletteChip
              width={250}
              height={250}
              avatar_id={finale_data.player.avatar}
            />
            <div className="finale-player-name">{finale_data.player.alias}</div>
            <div className="finale-player-datum">
              {finale_data.player.checkpoints} hashtags found!
            </div>
          </div>
          {event.skin === 'space' && (
            <video src="/casino/space/videos/liz-finale-2.mp4" autoPlay muted />
          )}
          {event.skin === 'normal' && (
            <video src="/casino/videos/morgan.mp4" autoPlay muted />
          )}
        </div>
      )}
      {phase === 'emily-cat' && (
        <div className="finale-split finale-split-video-left">
          <div>
            <h2>
              <FlashyText text="You helped Ramona foster a cat in need!" />
            </h2>
          </div>
          <video src="/casino/videos/emily.mp4" autoPlay muted />
        </div>
      )}
      {phase === 'most-slot-spins' && (
        <div className="finale-split finale-split-video-left">
          <div className="finale-player">
            <h2>
              <FlashyText text="Slot Spinner" />
            </h2>
            <RouletteChip
              width={250}
              height={250}
              avatar_id={finale_data.player.avatar}
            />
            <div className="finale-player-name">{finale_data.player.alias}</div>
            <div className="finale-player-datum">
              {finale_data.player.slot_spins} spins!
            </div>
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
      )}{' '}
      {phase === 'most-popular-slot' && (
        <div className="finale-split finale-split-video-left">
          <div className="finale-player">
            <h2>
              <FlashyText text="Most Popular Slot" />
            </h2>

            <div className="finale-player-name">
              {finale_data.slotMachine.name}
            </div>
            <div className="finale-player-datum">
              {finale_data.slotMachine.spins} spins!
            </div>
          </div>

          <video src="/casino/videos/liz.mp4" autoPlay muted />
        </div>
      )}{' '}
      {phase === 'end' && (
        <div className="finale-split finale-split-video-left">
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
