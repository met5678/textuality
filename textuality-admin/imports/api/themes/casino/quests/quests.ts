import { Mongo } from 'meteor/mongo';

import { Quest, QuestSchema } from '/imports/schemas/quest';

interface QuestWithHelpers extends Quest {}

const Quests = new Mongo.Collection<Quest, QuestWithHelpers>('quests');

Quests.attachSchema(QuestSchema);

export default Quests;
export { QuestWithHelpers };
