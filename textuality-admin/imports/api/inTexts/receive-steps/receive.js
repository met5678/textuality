import checkPlayerIsNew from './check-player-is-new';
import checkPlayerIsTentative from './check-player-is-tentative';
import checkPlayerIsQuit from './check-player-is-quit';
import checkSystemText from './check-system-text';
// import checkHashtag from './check-hashtag';
import checkFeedMedia from './check-feed-media';
import checkFeedText from './check-feed-text';

const steps = [
  checkPlayerIsNew,
  checkPlayerIsTentative,
  checkPlayerIsQuit,
  checkSystemText,
  checkFeedMedia,
  checkFeedText
  // checkHashtag
];

function receive({ inText, player, media }) {
  let args = { inText, player, media };
  for (let step of steps) {
    if (step.test(args)) {
      args = step.action(args);
      if (args.handled) break;
    }
  }
  return args.inText;
}

export default receive;
