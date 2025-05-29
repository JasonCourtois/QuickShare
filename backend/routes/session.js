const express = require('express');
const Session = require('../models/Session');
const router = express.Router();

/* Create needs two things in the body of request
    - expiresInMinutes: How many minutes until session expires - integer
    - files: Array of files with the following [
            cdn_url: String
            name: String
            ]
*/
router.post('/create', async (req, res) => {
    const { expireInMinutes, files } = req.body;
    
    // Date stored in milliseconds, convert minutes to milliseconds
    const expiresAt = new Date(Date.now() + expireInMinutes * 60 * 1000);

    try {
        const session = await Session.create({
            files: files,
            expires_at: expiresAt
        })
        
        return res.status(201).json({ session_id: session._id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;