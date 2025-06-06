const mongoose = require('mongoose');
const fileSchema = require('./File');

const sessionSchema = new mongoose.Schema({
    created_at: { type: Date, default: Date.now },
    id: { type: String, required: true, unique: true },
    expires_at: { type: Date, required: true, expires: 0 },
    files: { type: [fileSchema], default: [] }
});

module.exports = mongoose.model('Session', sessionSchema);