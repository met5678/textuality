import { useFind, useSubscribe, useTracker } from 'meteor/react-meteor-data';
import Tellers from '/imports/api/themes/derby/tellers';
import RaceBets from '/imports/api/themes/derby/raceBets';
import Players from '/imports/api/players';
export const useTellerScreenData = ({
  eventId,
  url,
}: {
  eventId: string;
  url: string;
}) => {
  const tellerIsLoading = useSubscribe('derby.tellers.forUrl', url);
  const tellers = useFind(() => Tellers.find({ url }), [url]);
  const teller = tellers[0];

  useSubscribe('derby.raceBets.forTeller', teller?._id);

  const raceBets = useFind(
    () => RaceBets.find({ tellerId: teller?._id }),
    [teller?._id],
  );
  const raceBet = raceBets[0];

  useSubscribe('players.basic.forId', raceBet?.player);
  const player = useFind(
    () => Players.find({ _id: raceBet?.player }),
    [raceBet?.player],
  );

  return { isLoading: tellerIsLoading, teller, raceBet, player };
};
