const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
const app = express();

const server = http.createServer(app);

// Let set up our friends from db.js
const db = require('./db');

app.get('/friends', (req, res) => {

    let htmlString = ``;

    htmlString += `<ul>`;
    for (let friend of db) {
        // Put each friends name property into an <li> tag
        htmlString += `<li>
            <a href="${req.path}${friend.handle}">${friend.name}</a>
        </li>`
    }
    htmlString += `</ul>`;
    res.send(htmlString);
})

app.get('/friends/:handle', (req, res, next) => {
    const handle = req.params.handle;
    const friend = db.find((f) => {
        return f.handle === handle;
    })

    if (!friend) {
        next();
    }
    
    htmlString = ``;
    htmlString += `<h1>${friend.name}</h1>`
    htmlString += `<h3>${friend.handle}</h3>`
    htmlString += `<h3>${friend.skill}</h3>`

    res.send(htmlString);
})


app.get('*', (req, res) => {
    console.log(`matched from ${req.path}`)
    res.status(404).send(`<h1>404 - Not Found</h1>`)
})



server.listen(port, hostname, () =>{
    console.log(`Server running on http://${hostname}:${port}`);
})