const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
const app = express();

const es6Renderer = require('express-es6-template-engine');
// Defining the template engine
app.engine('html', es6Renderer);
// Set up a "views" directory
app.set('views', 'views');
app.set('view engine', 'html');

const server = http.createServer(app);

// Let set up our friends from db.js
const db = require('./db');

// Set up the Home Page, available at the "/" route
app.get('/', (req, res) => {
    // This render() method is how we tell Express
    // to look into the templates directory
    // for a view named 'home', and process it 
    // with our rendering engine
    res.render('home', {
        locals: {
            title: 'Address Book'
        },
        partials: {
            head: '/partials/head'
        }
    });
})

app.get('/friends', (req, res) => {

    let friendsListHtml = db.map(friend => {
        return `<li>${friend.name}</li>`
    }).join('');

    res.render('friends-list', {
        locals: {
            friendsListHtml,
            title: 'Friends List'
        },
        partials: {
            head: '/partials/head'
        }
    })
 
})

app.get('/friends/:handle', (req, res, next) => {
    const handle = req.params.handle;
    const friend = db.find((f) => {
        return f.handle === handle;
    })

    if (!friend) {
        next();
    }

    res.render('friend', {
        locals: {
            friend: friend,
            title: `${friend.name}'s Profile Page`
        },
        partials: {
            head: '/partials/head'
        }
    });
    
})


app.get('*', (req, res) => {
    console.log(`matched from ${req.path}`)
    res.status(404).send(`<h1>404 - Not Found</h1>`)
})



server.listen(port, hostname, () =>{
    console.log(`Server running on http://${hostname}:${port}`);
})