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
    db.forEach((value, key) => {
        youtubers[key] = value;
    });
    res.json(youtubers);
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
        res.json({
            error: 'Please provide all the required fields! (nickname, subscribers, views, country, joined, videos, category)'
        });
        return;
    }

    db.set(youtubersCount++, req.body);

    res.json({
       success: true 
    });
});

// Update a YouTube channel
app.put('/youtubers/:id', (req, res) => {
    let {id} = req.params;
    id = parseInt(id);
    const user = db.get(d);

    if (!user){
        res.json({
            error: 'No such channel!'
        });
        return;
    }

    const {
        subscribers,
        views,
        country,
        joined,
        videos,
        category
    } = req.body;

    // update the user if the field is provided
    db.set(id, {
        nickname: nickname || user.nickname,
        subscribers: subscribers || user.subscribers,
        views: views || user.views,
        country: country || user.country,
        joined: joined || user.joined,
        videos: videos || user.videos,
        category: category || user.category
    });

    res.json(db.get(id));
});

// Get a YouTube channel
app.get('/youtubers/:id', (req, res) => {
     const {id} = req.params;
     const user = db.get(parseInt(id));
     const userDataObj = {};

     // Check if the user exists
     if (!user){
         res.json({
             error: 'No such channel!'
         });
         return;
     }
    
     res.json(user);
});

// Delete all YouTube channels
app.delete('/youtubers', (req, res) => {
    if (db.size <= 0) {
        res.json({
            error: 'No channels to delete!'
        });
        return;
    }

    db.clear();
    res.json({
        success: true,
        message: 'All channels have been deleted!'
    });
});


// Delete a YouTube channel
app.delete('/youtubers/:id', (req, res) => {
    let {id} = req.params;
    id = parseInt(id); 
    const user = db.get(id);

    // Check if the user exists
    if (!user){
        res.json({
            error: 'No such channel!'
        });
        return;
    }

    // Delete the user
    db.delete(id);
    res.json({
        success: true,
        message: `${user.nickname} has been deleted!`
    });
});

app.listen(8888, () => {
    console.log('Server is running on port 8888!');
});