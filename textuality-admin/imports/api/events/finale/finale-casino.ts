import { Meteor } from 'meteor/meteor';
import Players from '../../players';
import Events from '../events';
import waitForSeconds from '../../rounds/reveal-sequence/_wait-for-seconds';
import SlotMachines from '../../themes/casino/slotMachines';

function getEligiblePlayers() {
  return Players.find({ event: Events.currentId()!, status: 'active' }).fetch();
}

let currentTimeout = null;

Meteor.methods({
  'finale.casino.start': async (eventId) => {
    const event = Events.findOne(eventId);
    if (!event) return;

    const players = getEligiblePlayers();

    players.forEach((player) => {
      Meteor.call('autoTexts.send', {
        trigger: 'FINALE_START',
        playerId: player._id,
      });
    });

    // await waitForSeconds(11);

    Events.update(eventId, {
      $set: { state: 'finale', 'finale_data.phase': 'pre' },
    });
    await waitForSeconds(11);

    // Play Jackie Video
    Events.update(eventId, { $set: { 'finale_data.phase': 'hacker-appears' } });

    await waitForSeconds(11);

    const totalMoney = Players.find(
      { event: Events.currentId()! },
      { fields: { money: 1 } },
    )
      .fetch()
      .reduce((acc, player) => acc + player.money, 0);

    let finaleData: any = {
      phase: 'total-money',
      totalMoney,
    };

    Events.update(eventId, { $set: { finale_data: finaleData } });

    await waitForSeconds(11);

    const playerWithMostMoney = Players.find(
      { event: Events.currentId()! },
      { sort: { money: -1 }, limit: 1 },
    ).fetch();
    if (playerWithMostMoney.length) {
      finaleData = {
        phase: 'most-money',
        player: {
          alias: playerWithMostMoney[0].alias,
          avatar: playerWithMostMoney[0].avatar,
          money: playerWithMostMoney[0].money,
        },
      };
      Events.update(eventId, { $set: { finale_data: finaleData } });
      await waitForSeconds(11);
    }

    const playersWithCheckpoints = Players.find(
      { event: Events.currentId()! },
      { fields: { checkpoints: 1, alias: 1, avatar: 1 } },
    ).fetch();

    if (playersWithCheckpoints) {
      const playerWithMostCheckpoints = playersWithCheckpoints.reduce(
        (acc, player) => {
          if (player.checkpoints.length > acc.checkpoints.length) {
            return player;
          }
          return acc;
        },
        { checkpoints: [] },
      );
      finaleData = {
        phase: 'most-checkpoints',
        player: {
          alias: playerWithMostCheckpoints.alias,
          avatar: playerWithMostCheckpoints.avatar,
          checkpoints: playerWithMostCheckpoints.checkpoints.length,
        },
      };
      Events.update(eventId, { $set: { finale_data: finaleData } });

      await waitForSeconds(11);
    }

    finaleData = { phase: 'emily-cat' };
    Events.update(eventId, { $set: { finale_data: finaleData } });

    await waitForSeconds(11);

    const playerWithSlotSpins = Players.find(
      { event: Events.currentId()! },
      { fields: { avatar: 1, alias: 1, slot_spins: 1 } },
    ).fetch();
    if (playerWithSlotSpins) {
      const playerWithMostSlotSpins = playerWithSlotSpins.reduce(
        (acc, player) => {
          if (player.slot_spins.length > acc.slot_spins.length) {
            return player;
          }
          return acc;
        },
        { slot_spins: [] },
      );
      finaleData = {
        phase: 'most-slot-spins',
        player: {
          alias: playerWithMostSlotSpins.alias,
          avatar: playerWithMostSlotSpins.avatar,
          slot_spins: playerWithMostSlotSpins.slot_spins.length,
        },
      };
      Events.update(eventId, { $set: { finale_data: finaleData } });

      await waitForSeconds(11);
    }

    const slotMachineWithMostSpins = SlotMachines.find(
      { event: Events.currentId()! },
      { sort: { 'stats.spin_count': -1 }, limit: 1 },
    ).fetch();
    if (slotMachineWithMostSpins[0]) {
      finaleData = {
        phase: 'most-popular-slot',
        slotMachine: {
          name: slotMachineWithMostSpins[0].name,
          spins: slotMachineWithMostSpins[0].stats.spin_count,
        },
      };
      Events.update(eventId, { $set: { finale_data: finaleData } });

      await waitForSeconds(11);
    }

    Events.update(eventId, { $set: { 'finale_data.phase': 'end' } });

    await waitForSeconds(11);

    Events.update(eventId, { $set: { finale_data: {}, state: 'normal' } });

    Meteor.call('finale.endMessage', eventId);
  },

  'finale.endMessage': (eventId) => {
    const players = Players.find({
      event: Events.currentId()!,
    }).fetch();

    players.forEach((player) => {
      console.log(player._id);
      Meteor.call('autoTexts.send', {
        trigger: 'END_MESSAGE',
        playerId: player._id,
      });
    });
  },
});
