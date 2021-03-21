const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bug = new Schema({
    title: {type: String},
    description: {type: String},
    reported: {type: Date},
    assignee: {type: String},
    resolved: {type: Boolean, default: false}

}, { timestamps: true });

module.exports = mongoose.model('bug', bug, 'bugs');