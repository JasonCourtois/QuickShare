const express = require('express');
const Session = require('../models/Session');
const generateId = require('../helpers/generateId');
const { isInvalidArray, isInvalidNumber, isInvalidPath, isInvalidSessionId, isInvalidFileId } = require('../helpers/inputValidators');
const router = express.Router();

/* Create needs two things in the body of request
    - expireInMinutes: How many minutes until session expires - integer
    - files (optional): Array of files with the following [
            cdn_url: String
            name: String
            id: String (20 characters)
            ]
*/
router.post('/create', async (req, res, next) => {
    try {
        const { expireInMinutes, files } = req.body;
        
        // Validation
        if (isInvalidNumber(expireInMinutes)) {
            return res.status(400).json({ error: 'expireInMinutes required and must be a number '});
        }

        if (files) {
            for (const file of files) {
                if (isInvalidPath(file.cdn_url)) {
                    return res.status(400).json({ error: 'Each file must have cdn_url as a non-empty string' });
                }

                if (isInvalidPath(file.name)) {
                    return res.status(400).json({ error: 'Each file must have name as a non-empty string' });
                }
                
                if (isInvalidFileId(file.id)) {
                    console.log("invalid");
                    return res.status(400).json({ error: 'Each file must have a 20 character id '});
                }
            }
        }

        // Date stored in milliseconds, convert minutes to milliseconds
        const expiresAt = new Date(Date.now() + expireInMinutes * 60 * 1000);

        // generateId using nano id
        const id = await generateId();

        const session = await Session.create({
            files: files,
            id: id,
            expires_at: expiresAt
        })

        res.status(201).json({ id: session.id });
    } catch (error) {
        next(error);
    }
});

/* Gets the cdn_url and AppWrite ID for a specified file within a session
    - id: 5 character string defining the session id
    - name: non-zero string defining the requested file name
*/
router.get('/download/:id/:name', async (req, res, next) => {
    try {
        const { id, name } = req.params;
       
        // Validation
        if (isInvalidSessionId(id)) {
            return res.status(400).json({ error: "id must be a string that's 5 characters long" });
        }

        if (isInvalidPath(name)) {
            return res.status(400).json({ error: 'name of file must be a string with length greater than 0' });
        }

        // Find a session that has the given id and name, then project only the matching file name
        const sessionData = await Session.findOne( { id: id, 'files.name': name }, { 'files.$': 1 } );

        // If no session was found, or a session was found but with no files - display error
        if (!sessionData || !sessionData.files || sessionData.files.length === 0) {
            return res.status(404).json({ error: `No file with name '${name}' found`});
        }
        
        res.status(200).json({ cdn_url: sessionData.files[0].cdn_url, id: sessionData.files[0].id });
    } catch (error) {
        next(error);
    }
});

/*
    Get a list of all files from a given session id
    - id: String (5 character session id)
*/
router.get('/files/:id', async (req, res, next) => {
    try {
         const { id } = req.params;

        if (isInvalidSessionId(id)) {
            return res.status(400).json({ error: "id must be a string that's 5 characters long" });
        }

        const sessionData = await Session.findOne({ id: id });
        
        if (!sessionData || !sessionData.files) {
            return res.status(404).json({error: `No session with id ${id} found`})
        }

        res.status(200).json({ files: sessionData.files});
    } catch (error) {
        next(error);
    }
});

/* Add a file to a session
    - id: 5 character string in dynamic route to specify id
    - files (in body of request - must be non-empty): Array of files with the following [
            cdn_url: String
            name: String
            id: String (20 characters)
            ]
*/
router.post('/upload/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { files } = req.body;

        // Input validation
        if (isInvalidSessionId(id)) {
            return res.status(400).json({ error: "id must be a string that's 5 characters long" });
        }
    
        if (isInvalidArray(files) || files.length === 0) {
            return res.status(400).json({ error: 'file array must be given and non empty' })
        }

        for (const file of files) {
            if (isInvalidPath(file.cdn_url)) {
                return res.status(400).json({ error: 'Each file must have cdn_url as a non-empty string' });
            }

            if (isInvalidPath(file.name)) {
                return res.status(400).json({ error: 'Each file must have name as a non-empty string' });
            }
            
            if (isInvalidFileId(file.id)) {
                    return res.status(400).json({ error: 'Each file must have a 20 character id '});
            }
        }

        // Finding existing session
        const sessionData = await Session.findOne({ id: id })

        if (!sessionData) {
            return res.status(404).json({ error: `No session with id: ${id} found.` })
        }

        // Make sure no files have same name
        for (const newFile of files) {
            const filenameExists = sessionData.files.some(file => file.name === newFile.name);

            if (filenameExists) {
                return res.status(400).json({ error: `File with name ${newFile.name} already exists `});
            }

            sessionData.files.push(newFile);
        }

        // Attempt to save data
        await sessionData.save();

        res.status(200).json({ message: "File added successfully" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;