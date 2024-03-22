const express = require('express');
const app = express();

let youtubersCount = 1;

const db = new Map();
const youtubers = {
    'pewdiepie': {
        nickname: 'pewdiepie',
        subscribers: 110000000,
        views: 27000000000,
        country: 'Sweden',
        joined: 'Apr 29, 2010',
        videos: 4200,
        category: 'Gaming',
    },
    'tseries': {
        nickname: 'tseries',
        subscribers: 120000000,
        views: 100000000000,
        country: 'India',
        joined: 'Mar 13, 2006',
        videos: 15000,
        category: 'Music',
    },
    'cocomelon': {
        nickname: 'cocomelon',
        subscribers: 110000000,
        views: 100000000000,
        country: 'USA',
        joined: 'Sep 1, 2006',
        videos: 500,
        category: 'Entertainment',
    },
    'setindia': {
        nickname: 'setindia',
        subscribers: 110000000,
        views: 100000000000,
        country: 'India',
        joined: 'Sep 20, 2006',
        videos: 30000,
        category: 'Entertainment',
    },
};

// convert object to map
Object.keys(youtubers).forEach(key => {
    db.set(youtubersCount++, youtubers[key]);
});

app.use(express.json());

// Get all YouTube channels
app.get('/youtubers', (req, res) => {
    const youtubers = {};

    // Check if there are any channels to show
    if (db.size > 0){
        db.forEach((value, key) => {
            youtubers[key] = value;
        });
        res.json(youtubers);
    }

    // If there are no channels to show
    res.status(404).json({
        error: 'No channels to show!'
    });
});

// Create a new YouTube channel
app.post('/youtubers', (req, res) => {
    const { 
        nickname,
        subscribers,
        views,
        country,
        joined,
        videos,
        category
    } = req.body;

    // Check if req.body is empty and provide all the required data fields
    if (!nickname || !subscribers || !views || !country || !joined || !videos || !category) {
        res.status(400).json({
            error: 'Please provide all the required fields! (nickname, subscribers, views, country, joined, videos, category)'
        });
        return;
    }

    // add the new user to the database
    db.set(youtubersCount++, req.body);
    res.status(201).json({
       success: true 
    });
});

// Update a YouTube channel
app.put('/youtubers/:id', (req, res) => {
    let {id} = req.params;
    id = parseInt(id);
    const user = db.get(id);

    // Check if the user exists
    if (user){
        const {
            nickname,
            subscribers,
            views,
            country,
            joined,
            videos,
            category
        } = req.body;

        // Check if req.body is empty and provide all the required data fields
        if (
            !nickname ||
            !subscribers ||
            !views ||
            !country ||
            !joined ||
            !videos ||
            !category
        ){
            res.status(400).json({
                error: 'Please provide all the required fields! (nickname, subscribers, views, country, joined, videos, category)'
            });
            return;
        }

        // Update the user
        db.set(id, req.body);
        res.json({
            success: true,
            message: `User ${id} has been updated!`
        });
        return
    }

    res.status(404).json({
        error: 'No such channel!'
    });
});

// Get a YouTube channel
app.get('/youtubers/:id', (req, res) => {
     const {id} = req.params;
     const user = db.get(parseInt(id));
     const userDataObj = {};

     // Check if the user exists
     if (user){
         res.json(user);
         return;
     }
    
    res.status(404).json({
        error: 'No such channel!'
    });
});

// Delete all YouTube channels
app.delete('/youtubers', (req, res) => {
    // Check if there are any channels to delete
    if (db.size > 0) {
        // Clear the database
        db.clear();
        res.json({
            success: true,
            message: 'All channels have been deleted!'
        });
    }

    // If there are no channels to delete
    res.status(404).json({
        error: 'No channels to delete!'
    });
});


// Delete a YouTube channel
app.delete('/youtubers/:id', (req, res) => {
    let {id} = req.params;
    id = parseInt(id); 
    const user = db.get(id);

    // Check if the user exists
    if (user){
        db.delete(id);
        res.json({
            success: true,
            message: `${user.nickname} has been deleted!`
        });
    }

    res.status(404).json({
        error: 'No such channel!'
    });
});

app.listen(8888, () => {
    console.log('Server is running on port 8888!');
});