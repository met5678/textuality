import React from 'react';
import { Event } from '/imports/schemas/event';
import './HorseRaceScreen.css';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import Races from '/imports/api/themes/derby/race';
import { RaceActiveSubsceen } from './subscreens/RaceActive/RaceActiveSubscreen';
import { RaceBettingSubscreen } from './subscreens/RaceBetting/RaceBettingSubscreen';
import { RaceIntroSubscreen } from './subscreens/RaceIntro/RaceIntroSubscreen';
import { RaceBetWinnersSubscreen } from './subscreens/RaceBetWinners/RaceBetWinnersSubscreen';
import { RaceResultsSubscreen } from './subscreens/RaceResults/RaceResultsSubscreen';

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
      {['future', 'bets-open'].includes(race.status) && (
        <RaceBettingSubscreen race={race} />
      )}
      {race.status === 'intro' && <RaceIntroSubscreen race={race} />}
      {race.status === 'active' && <RaceActiveSubsceen race={race} />}
      {race.status === 'bet-winners' && <RaceBetWinnersSubscreen race={race} />}
      {race.status === 'results' && <RaceResultsSubscreen race={race} />}
    </div>
  );
};

export default HorseRaceScreen;
