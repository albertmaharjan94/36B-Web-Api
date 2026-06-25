// src/__tests__/__mocks__/uuid.js
module.exports = {
    v4: () => 'test-uuid-' + Date.now(), // mock uuidv4 to return a unique string based on the current timestamp
};