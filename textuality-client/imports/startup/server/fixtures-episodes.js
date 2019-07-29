import Episodes from 'api/episodes';
import Queens from 'api/queens';

if (!Episodes.findOne()) {
  Episodes.insert({
    week: 1,
    season: 'dev',
    title: 'Premiere Episode',
    episodeType: 'normal'
  });

  const queens = Queens.find({ season: '11' })
    .fetch()
    .map(queen => queen._id);

  Episodes.insert({
    week: 0,
    season: '11',
    title: 'Whatcha Unpackin?',
    episodeType: 'normal',
    queens,
    results: {
      winner: [queens[0]],
      high: [queens[1], queens[2]],
      low: [queens[queens.length - 3]],
      survivor: [queens[queens.length - 2]],
      loser: [queens[queens.length - 1]],
      mini: []
    }
  });

  queens.pop();

  Episodes.insert({
    week: 1,
    season: '11',
    title: 'Second Episode',
    episodeType: 'normal',
    queens,
    results: {
      winner: [queens[1]],
      high: [queens[2], queens[3]],
      low: [queens[queens.length - 3]],
      survivor: [queens[queens.length - 2]],
      loser: [queens[queens.length - 1]],
      mini: [queens[queens.length - 4]]
    }
  });

  queens.pop();

  Episodes.insert({
    week: 2,
    season: '11',
    title: 'Third Episode',
    episodeType: 'normal',
    queens,
    results: {
      winner: [queens[2]],
      high: [queens[3], queens[4]],
      low: [queens[queens.length - 3]],
      survivor: [queens[queens.length - 2]],
      loser: [queens[queens.length - 1]],
      mini: [queens[queens.length - 4]]
    }
  });

  queens.pop();

  Episodes.insert({
    week: 3,
    season: '11',
    title: 'Fourth Episode',
    episodeType: 'normal',
    queens,
    results: {
      winner: [queens[3]],
      high: [queens[4], queens[5]],
      low: [queens[queens.length - 3]],
      survivor: [queens[queens.length - 2]],
      loser: [queens[queens.length - 1]],
      mini: [queens[queens.length - 4]]
    }
  });
}
