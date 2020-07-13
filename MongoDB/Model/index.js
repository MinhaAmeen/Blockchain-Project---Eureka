const dbConfig = require("../Config/config");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.users = require("./User")(mongoose);
db.reviews = require("./Review")(mongoose);
db.authors = require("./Author")(mongoose);

module.exports = db;