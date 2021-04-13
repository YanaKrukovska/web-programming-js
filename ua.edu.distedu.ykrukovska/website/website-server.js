const credentials = require('./mail-credentials');

let bodyParser = require('body-parser');
let express = require('express');
let app = express();
const config = require('./config.json')
const resources = require('./resources.json')
let nodemailer = require('nodemailer');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/public', express.static('public'));
app.set("view engine", "twig");

const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, {useUnifiedTopology: true});
let db;
let trainingsCollection;
let requestsCollection;
mongoClient.connect(function (err, client) {
    db = client.db("CoolWebsiteDB");
    trainingsCollection = db.collection("trainings");
    requestsCollection = db.collection("requests");
});

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: credentials.mail,
        pass: credentials.password
    }
});

function getAllTrainings(callback) {
    trainingsCollection.find({}).toArray(function (err, result) {
        callback(result);
    });
}

function getAllRequests(callback) {
    requestsCollection.find({}).toArray(function (err, result) {
        callback(result);
    });
}

app.get('/training/all', function (req, res) {
    getAllTrainings(function (trainings) {
        res.send(trainings);
    });
});

app.get('/', function (req, res) {
    res.render(__dirname + "\\views\\main.twig", {
        config: config,
        resources: config
    });
});


app.get("/trainings", function (req, res) {
    getAllTrainings(function (allTrainings) {
        res.render(__dirname + "\\views\\trainings.twig", {
            config: config,
            trainingsData: allTrainings,

        });
    });
});

app.get("/about", function (req, res) {
    res.render(__dirname + "\\views\\about.twig", {
        config: config
    });
});

app.get("/admin/request", function (req, res) {
    getAllRequests(function (requestsData) {
        res.render(__dirname + "\\views\\admin-requests.twig", {
            config: config,
            requests: requestsData
        });
    });
});

app.post('/request/add', function (req, res) {
    requestsCollection.insertOne(
        {
            surname: req.body.surname,
            name: req.body.name,
            mail: req.body.mail,
            phone: req.body.phone,
            message: req.body.message,
        }
    );
    let isLetterConfirmationOn = config.letterVerification;

    if (isLetterConfirmationOn) {
        let mailOptions = {
            from: credentials.mail,
            to: req.body.mail,
            subject: config.websiteTitle,
            text: 'Ваша заявка була прийнята!'
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
    res.json(isLetterConfirmationOn).send();
});

app.post('/request/delete', function (req, res) {
    requestsCollection.deleteOne({_id: new mongo.ObjectID(req.body.requestId)});
    res.redirect('/admin/request');
});

app.post('/request/settings', function (req, res) {
    config.letterVerification = !config.letterVerification;
    res.redirect('/admin/request');
});

app.get("/admin/training", function (req, res) {
    res.render(__dirname + "\\views\\admin-training.twig", {
        config: config
    });
});

app.post('/training/add', function (req, res) {
    trainingsCollection.insertOne(
        {
            name: req.body.name,
            description: req.body.description
        }
    );
    res.redirect('/trainings');
});

app.listen(8888);
console.log('Server is running on port 8888');
