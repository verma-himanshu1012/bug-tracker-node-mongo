const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bug = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    reported: {type: Date, default: Date.now},
    assignee: {type: String, required: true},
    resolved: {type: Boolean, default: false}

}, { timestamps: true });

module.exports = mongoose.model('bug', bug, 'bugs');