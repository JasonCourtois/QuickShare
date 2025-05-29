const mongoose = require('mongoose');
const fileSchema = require('./File');

const sessionSchema = new mongoose.Schema({
    created_at: { type: Date, default: Date.now },
    expires_at: { type: Date, required: true, index: { expires: 0 } },
    files: { type: [fileSchema] }
});

module.exports = mongoose.model('Session', sessionSchema);