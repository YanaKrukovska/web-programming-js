let bodyParser = require('body-parser');
let express = require('express');
let app = express();
const config = require('./config.json')

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/public', express.static('public'));
app.set("view engine", "twig");

const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, {useUnifiedTopology: true});
let db;
let collection;
mongoClient.connect(function (err, client) {
    db = client.db("CoolWebsiteDB");
    collection = db.collection("trainings");
});

function getAllTrainings(callback) {
    collection.find({}).toArray(function (err, result) {
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
        websiteTitle: config.websiteTitle,
        domainName: config.domainName,
        menu: config.menuItems,
        img: config.img
    });
});


app.get("/trainings", function (req, res) {
    getAllTrainings(function (allTrainings) {
        res.render(__dirname + "\\views\\trainings.twig", {
            websiteTitle: config.websiteTitle,
            domainName: config.domainName,
            menu: config.menuItems,
            trainingsData: allTrainings
        });
    });
});

app.get("/about", function (req, res) {
    res.render(__dirname + "\\views\\about.twig", {
        websiteTitle: config.websiteTitle,
        domainName: config.domainName,
        menu: config.menuItems
    });
});

app.listen(8888);
console.log('Server is running on port 8888');
