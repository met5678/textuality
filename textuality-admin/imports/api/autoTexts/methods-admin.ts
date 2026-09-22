import { Meteor } from 'meteor/meteor';

import AutoTexts from './autoTexts';
import { AutoText, AutoTextId } from '/imports/schemas/autoText';
import { OptionalId, UpdateRequiredId } from '/imports/utils/optional-id';

Meteor.methods({
  'autoTexts.new': async (autoText: OptionalId<AutoText>) => {
    const id = await AutoTexts.insertAsync(autoText);
    return id;
  },

  'autoTexts.update': async (autoText: UpdateRequiredId<AutoText>) => {
    await AutoTexts.updateAsync(autoText._id!, { $set: autoText });
    return await AutoTexts.findOneAsync(autoText._id);
  },

  'autoTexts.upsert': async (autoText: OptionalId<AutoText>) => {
    if (!autoText._id) {
      const id = await AutoTexts.insertAsync(autoText);
      const insertedDoc = await AutoTexts.findOneAsync(id);
      return insertedDoc;
    } else {
      const id = autoText._id;
      delete autoText._id;
      await AutoTexts.updateAsync(id, { $set: autoText });
      const updatedDoc = await AutoTexts.findOneAsync(id);
      return updatedDoc;
    }
  },

  'autoTexts.delete': async (autoTextId: AutoTextId | AutoTextId[]) => {
    if (Array.isArray(autoTextId)) {
      await AutoTexts.removeAsync({ _id: { $in: autoTextId } });
    } else {
      await AutoTexts.removeAsync(autoTextId);
    }
  },

  'autoTexts.copyFrom': async (
    destinationEventId: string,
    sourceEventId: string,
  ) => {
    // First, delete existing achievements in the destination event
    await AutoTexts.removeAsync({ event: destinationEventId });

    const sourceAutoTexts = AutoTexts.find({ event: sourceEventId }).fetch();
    for (const sourceAutoText of sourceAutoTexts) {
      const destinationAutoText: OptionalId<AutoText> = {
        ...sourceAutoText,
        event: destinationEventId,
      };
      delete destinationAutoText._id;
      await AutoTexts.insertAsync(destinationAutoText);
    }
  },
});
