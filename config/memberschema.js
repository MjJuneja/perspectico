'use strict';

const mongoose = require("./connection");
const config = require("./config");
const schema = mongoose.Schema;

const memberSchema = new schema({
    memberId: String,
    picUrl: String,
    name: String,
    designation: String,
    description: String,
    fblink: String,
    twlink: String,
    lklink: String,
    joinDate: Date,
    postedByEmail: String,
    randomNumber: Number,
    priority: Number
});

const Members = mongoose.model(config.dbMembers, memberSchema);

module.exports = Members;