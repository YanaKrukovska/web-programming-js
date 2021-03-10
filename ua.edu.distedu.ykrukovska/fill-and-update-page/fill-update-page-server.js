let bodyParser = require('body-parser');
let express = require('express');
let app = express();
const fs = require('fs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/public', express.static('public'));
app.listen(8888);

let WebSocketServer = require('ws');

let webSocketServer = new WebSocketServer.Server({
    port: 8889
});

webSocketServer.on('connection', function (ws) {

    ws.on('message', function () {
        webSocketServer.clients.forEach(c => c.send('server sent'));
    });

    ws.on('close', function () {
        console.log('closed connection');
    });

});

app.get('/data', function (req, res) {
    res.send(JSON.stringify(data));
});

const data = require('./data.json')
app.get('/admin', function (req, res) {
    res.sendFile(__dirname + "/admin.html");
});

app.get('/user', function (req, res) {
    res.sendFile(__dirname + "/user.html");
});

app.post('/post', function (req, res) {
    let newPost = {
        title: req.body.title,
        content: req.body.content
    };

    let jsonArray = require('./data.json');
    jsonArray.push(newPost);
    fs.writeFile('./data.json', JSON.stringify(jsonArray), function (err) {
    });

    res.sendStatus(200)
});

