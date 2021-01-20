const calculations = require('./csv-calculations');

let express = require('express');
let server = express();
server.set('view engine', 'ejs');
server.use(express.static(__dirname));

server.get('/', function (req, res) {
    res.render('index', {studentGrades: calculations.sortInitialOrder(calculations.readFile())});
});

server.get('/sort-ascending', function (req, res) {
    res.render('index', {studentGrades: calculations.sortAscending(calculations.readFile())});
});

server.get('/sort-descending', function (req, res) {
    res.render('index', {studentGrades: calculations.sortDescending(calculations.readFile())});
});

server.listen(8888);
console.log('Server is running on port 8888');




