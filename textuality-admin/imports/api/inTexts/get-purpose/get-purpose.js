function getPurpose({ message, player }) {
  if (player.status === 'new' || player.status === 'tentative') {
    return 'initial';
  }

  if (player.status === 'banned') {
    return 'ignore';
  }

  if (!message.body && message.media) {
    return 'mediaOnly';
  }

  if (message.body) {
    if (message.body.startsWith('/')) {
      return 'system';
    }

    if (message.body.startsWith('#')) {
      // if(Mission.current() && Mission.current().includesPlayer(player._id)) {
      //   return 'mission';
      // }
      return 'hashtag';
    }

    return 'feed';
  }
}

export default getPurpose;
