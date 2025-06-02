const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    cdn_url: { type: String, required: true },
    name: { type: String, required: true }
}, {_id: false });

module.exports = fileSchema