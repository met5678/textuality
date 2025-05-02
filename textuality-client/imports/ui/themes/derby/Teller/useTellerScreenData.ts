import { useFind, useSubscribe, useTracker } from 'meteor/react-meteor-data';
import Tellers from '/imports/api/themes/derby/tellers';
import RaceBets from '/imports/api/themes/derby/raceBets';
import Players from '/imports/api/players';
import { useWhyDidIRender } from '/imports/ui/hooks/use-why-did-i-render';
import Races from '/imports/api/themes/derby/race';

export const useTellerScreenData = ({
  eventId,
  url,
}: {
  eventId: string;
  url: string;
}) => {
  const tellerIsLoading = useSubscribe('derby.tellers.forUrl', url);
  const tellers = useFind(
    () => Tellers.find({ url }, { fields: { time_left: 0 } }),
    [url],
  );
  const teller = tellers[0];

  useSubscribe('derby.raceBets.forTeller', teller?._id);
  const raceBets = useFind(
    () => RaceBets.find(teller?.current_bet),
    [teller?.current_bet],
  );
  const raceBet = raceBets[0];

  useSubscribe('races.currentOrNextLite', raceBet?.race);
  const races = useFind(() =>
    Races.find(
      { event: eventId },
      { fields: { time_bets_start_at: 1 }, sort: { time_bets_start_at: 1 } },
    ),
  );
  const race = races[0];

  const timeLeft = useFind(
    () => Tellers.find(teller?._id, { fields: { time_left: 1 } }),
    [teller?._id],
  )?.[0]?.time_left;

  useSubscribe('players.basic');
  const players = useFind(
    () => Players.find(teller?.current_player),
    [teller?.current_player],
  );
  const player = players[0];

  const loading = tellerIsLoading();

  return { loading, teller, raceBet, player, race, timeLeft };
};
