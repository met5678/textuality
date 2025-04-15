import React from 'react';
import { Event } from '/imports/schemas/event';
import './HorseRaceScreen.css';
import { useFind, useSubscribe, useTracker } from 'meteor/react-meteor-data';
import Races from '/imports/api/themes/derby/race';
import { RaceUpcoming } from './subscreens/RaceUpcoming';
import { RaceActiveSubsceen } from './subscreens/RaceActive/RaceActiveSubscreen';
import { RaceResults } from './subscreens/RaceResults';
import { RaceBetting } from './subscreens/RaceBetting';
import { RaceWinners } from './subscreens/RaceWinners';
import { RaceIntro } from './subscreens/RaceIntro';
import { RaceBettingSubscreen } from './subscreens/RaceBetting/RaceBettingSubscreen';

const HorseRaceScreen = ({ event }: { event: Event }) => {
  useSubscribe('races.currentOrNext');
  const races = useFind(() =>
    Races.find({ event: event._id }, { fields: { timeline: 0 } }),
  );
  const race = races[0];

  if (!race) {
    return (
      <div id="horse-race-screen">
        <h1>No Race</h1>
      </div>
    );
  }

  return (
    <div id="horse-race-screen">
      {race.status === 'active' && <RaceActiveSubsceen race={race} />}
      {race.status === 'bets-open' && <RaceBettingSubscreen race={race} />}
      {/* <h1>Horse Race</h1> */}
      {/* {race.status === 'future' && <RaceUpcoming />}
      {race.status === 'race-intro' && <RaceIntro />}
      {race.status === 'race-in-progress' && <RaceActive />}
      {race.status === 'race-results' && <RaceResults />}
      {race.status === 'race-bet-winners' && <RaceWinners />} */}
    </div>
  );
};

export default HorseRaceScreen;
