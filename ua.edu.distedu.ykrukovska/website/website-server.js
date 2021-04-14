const credentials = require('./mail-credentials');
const uaLocale = require('./locales/ua.json');
const enLocale = require('./locales/en.json');
const config = require('./config.json')

let bodyParser = require('body-parser');
let express = require('express');
let app = express();
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

function getLocale(queryLang){
    let lang;
    if (queryLang === 'en') {
        lang = enLocale;
        lang.menu = config.menuItemsEn;
    } else {
        lang = uaLocale;
        lang.menu = config.menuItemsUa;
    }
    return lang;
}

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
    let lang = getLocale(req.query.lang);

    res.render(__dirname + "\\views\\main.twig", {
        config: config,
        lang: lang
    });
});


app.get("/trainings", function (req, res) {
    let lang = getLocale(req.query.lang);

    getAllTrainings(function (allTrainings) {
        res.render(__dirname + "\\views\\trainings.twig", {
            config: config,
            trainingsData: allTrainings,
            lang: lang
        });
    });
});

app.get("/about", function (req, res) {
    let lang = getLocale(req.query.lang);
    res.render(__dirname + "\\views\\about.twig", {
        config: config,
        lang: lang
    });
});

app.get("/admin/request", function (req, res) {
    let lang = getLocale(req.query.lang);

    getAllRequests(function (requestsData) {
        res.render(__dirname + "\\views\\admin-requests.twig", {
            config: config,
            requests: requestsData,
            lang: lang
        });
    });
});

app.get("/admin/training", function (req, res) {
    let lang = getLocale(req.query.lang);

    res.render(__dirname + "\\views\\admin-training.twig", {
        config: config,
        lang: lang
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
    res.redirect('/admin/request?lang=' + req.query.lang);
});

app.post('/request/settings', function (req, res) {
    config.letterVerification = !config.letterVerification;
    res.redirect('/admin/request?lang=' + req.query.lang);
});


app.post('/training/add', function (req, res) {
    trainingsCollection.insertOne(
        {
            name: req.body.name,
            description: req.body.description
        }
    );
    res.redirect('/trainings?lang=' + req.query.lang);
});

app.listen(8888);
console.log('Server is running on port 8888');
