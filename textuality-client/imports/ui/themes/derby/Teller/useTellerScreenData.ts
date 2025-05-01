import { useFind, useSubscribe, useTracker } from 'meteor/react-meteor-data';
import Tellers from '/imports/api/themes/derby/tellers';
import RaceBets from '/imports/api/themes/derby/raceBets';
import Players from '/imports/api/players';
import { useWhyDidIRender } from '/imports/ui/hooks/use-why-did-i-render';

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

  const timeLeft = useFind(
    () => Tellers.find(teller?._id, { fields: { time_left: 1 } }),
    [teller?._id],
  )?.[0]?.time_left;

  useSubscribe('players.basic.forId', raceBet?.player);
  const player = useFind(
    () => Players.find({ _id: raceBet?.player }),
    [raceBet?.player],
  );

  const loading = tellerIsLoading();

  return { loading, teller, raceBet, player, timeLeft };
};
