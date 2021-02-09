const credentials = require('./credentials');

let express = require('express');
let server = express();
let nodemailer = require('nodemailer');
let bodyParser = require('body-parser');
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

server.set('view engine', 'ejs');
server.use(express.static(__dirname));

let data = [
    {
        id: 0,
        name: "Anakin",
        surname: "Skywalker",
        patronymic: "Palpatinovich",
        mail: ""
    },
    {
        id: 1,
        name: "Luke",
        surname: "Skywalker",
        patronymic: "Anakinovich",
        mail: ""
    },
    {
        id: 2,
        name: "Ben",
        surname: "Solo",
        patronymic: "Hanovich",
        mail: ""
    },
];

server.get('/', function (req, res) {
    res.render('spammer', {userData: data});
});

server.post('/edit-user', function (req, res) {
    res.render('edit-user', {user: data[req.body.idToEdit]});
});

server.get('/add-user', function (req, res) {
    res.render('add-user');
});

server.post('/update-user', function (req, res) {
    let id = req.body.idToUpdate;
    data[id].surname = req.body.userSurname;
    data[id].name = req.body.userName;
    data[id].patronymic = req.body.userPatronymic;
    data[id].mail = req.body.userEmail;
    res.redirect('/');
});

server.post('/create-user', function (req, res) {
    data.push({
        id: data[data.length - 1].id + 1,
        surname: req.body.userSurname,
        name: req.body.userName,
        patronymic: req.body.userPatronymic,
        mail: req.body.userEmail
    });
    res.redirect('/');
});

server.get('/prepare-mail', function (req, res) {
    res.render('send-mail', {mails: data});
});

server.post('/delete-user', function (req, res) {
    data.splice(data.findIndex(v => v.id === parseInt(req.body.currentId)), 1);

    res.redirect('/');
});

server.post('/send-mail', function (req, res) {

    let message = '';
    message = req.body.message[0] === 'Other' ? req.body.message[1] : req.body.message[0];

    let receivers = req.body.mailReceiver.join(', ');

    let mailOptions = {
        from: credentials.mail,
        to: receivers,
        subject: 'A message from a Galaxy far far away',
        text: message
    }

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: credentials.mail,
            pass: credentials.password
        }
    });

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.redirect('/');
});

server.listen(8888);
console.log('Server is running on port 8888');


