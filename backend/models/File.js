const mongoose = require('mongoose');

// Disable MongoDB's default _id value in place of AppWrite's id generated for each file
const fileSchema = new mongoose.Schema({
    cdn_url: { type: String, required: true },
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true }
}, {_id: false });

module.exports = fileSchema