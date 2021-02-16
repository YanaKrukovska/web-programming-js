const credentials = require('./credentials');

let express = require('express');
let server = express();
let nodemailer = require('nodemailer');
let bodyParser = require('body-parser');
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.set('view engine', 'ejs');
server.use(express.static(__dirname));

const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, {useUnifiedTopology: true});
let db;
let collection;
mongoClient.connect(function (err, client) {
    db = client.db("SpammerDB");
    collection = db.collection("mail");
});

function getAllUsersData(callback) {
    collection.find({}).toArray(function (err, result) {
        callback(result);
    });
}

server.get('/', function (req, res) {
    getAllUsersData(function (allUserData) {
        res.render('index', {userData: allUserData});
    });
});

server.get('/add-user', function (req, res) {
    res.render('add-user', {error: ''});
});

server.post('/edit-user', function (req, res) {
    collection.findOne({_id: new mongo.ObjectID(req.body.editId)}, function (err, result) {
        res.render('edit-user', {user: result, error: ''});
    });
});

server.post('/update-user', function (req, res) {
    let newUser = {
        name: req.body.userName,
        surname: req.body.userSurname,
        patronymic: req.body.userPatronymic,
        mail: req.body.userEmail
    };
    let updatedValues = {
        $set: newUser
    };
    collection.updateOne({_id: new mongo.ObjectID(req.body.idToUpdate)}, updatedValues, function (err) {
        if (err && err.name === 'MongoError' && err.code === 11000) {
            newUser._id = req.body.idToUpdate;
            res.render('edit-user', {user: newUser, error: 'This email is already in use!'});
        } else {
            res.redirect('/');
        }
    });
});

server.post('/create-user', function (req, res) {

    let newUser = {
        name: req.body.userName,
        surname: req.body.userSurname,
        patronymic: req.body.userPatronymic,
        mail: req.body.userEmail
    };

    collection.insertOne(newUser, function (err) {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                res.render('add-user', {error: 'User with such mail already exists'});
            } else {
                res.render('add-user', {error: 'Something went wrong'});
            }
        } else {
            res.redirect('/');
        }
    });

});

server.get('/prepare-mail', function (req, res) {
    getAllUsersData(function (allUserData) {
        res.render('send-mail', {mails: allUserData});
    });
});

server.post('/delete-user', function (req, res) {
    collection.deleteOne({_id: new mongo.ObjectID(req.body.currentId)});
    res.redirect('/');
});

server.post('/send-mail', function (req, res) {

    let message;
    message = req.body.message[0] === 'Other' ? req.body.message[1] : req.body.message[0];

    let receivers;
    if (typeof req.body.mailReceiver.length == 'object') {
        receivers = req.body.mailReceiver.join(', ');
    } else {
        receivers = req.body.mailReceiver;
    }

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


