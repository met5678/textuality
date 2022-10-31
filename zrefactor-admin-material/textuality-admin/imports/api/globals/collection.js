import { Mongo } from "meteor/mongo";

// import GlobalSchema from 'schemas/global';
import GlobalSchema from "../../schemas/global";

const Globals = new Mongo.Collection("globals");

Globals.attachSchema(GlobalSchema);

export default Globals;
