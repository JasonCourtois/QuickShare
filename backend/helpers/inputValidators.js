// Generic type validators
const isInvalidNumber = (input) => {
    return !input || typeof(input) !== 'number';
}

const isInvalidArray = (input) => {
    return !input || !Array.isArray(input)
}

const isInvalidString = (input) => {
    return !input || typeof(input) !== 'string';
}

// Specific input validators
const isInvalidSessionId = (id) => {
    return !id || typeof(id) !== 'string' || id.length !== 5;
}

const isInvalidFileId = (id) => {
    return !id || typeof(id) !== 'string' || id.length !== 20;
}

// Used for filenames and cdn_url inputs
const isInvalidPath = (name) => {
    return !name || typeof(name) !== 'string' || name.length === 0;
}

module.exports = { isInvalidArray, isInvalidNumber, isInvalidString, isInvalidSessionId, isInvalidPath, isInvalidFileId };