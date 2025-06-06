const { customAlphabet } = require('nanoid');
const Session = require('../models/Session');

// Generates a random 5-digit code used for session id.
const generateId = async () => {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const generateCode = customAlphabet(alphabet, 5);

    let id = generateCode();
    let unique = false;

    // TODO: Have this timeout after 10 seconds of failed attempts - only happen if this gets used lol
    while (!unique) {
        const existing = await Session.findOne({ id });

        if (!existing) {
            unique = true
        } else {
            id = generateCode();
        }
    }

    return id;
}

module.exports = generateId;