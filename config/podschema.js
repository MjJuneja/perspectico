'use strict';
// Step -3 Represent Schema

const mongoose = require("./connection");
const config = require("./config");
const schema = mongoose.Schema;
// Step -4  Creating Schema for the Collection
const podSchema = new schema({
    podId: String,
    coverUrl: String,
    fileUrl: String,
    title: String,
    subtext: String,
    description: String,
    type: String,
    uploadDate: Date,
    likes: Number,
    postedByUsername: String,
    postedByEmail: String,
    randomNumber: Number,
    verified: Boolean,
    verifiedBy: String,
    likedBy:[String]
});

const Pods = mongoose.model(config.dbPods, podSchema);

module.exports = Pods;