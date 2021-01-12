let http = require('http');
let express = require('express');

let server = express();
server.listen(8888);
console.log('Server is running on port 8888');

server.use(express.static(__dirname));
server.get('/p1', function (req, res) {
    res.sendFile(__dirname + "/firstpage.html");
});

server.get('/p2', function (req, res) {
    res.sendFile(__dirname + "/secondpage.html");
});
