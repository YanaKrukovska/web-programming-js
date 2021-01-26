let jsonArray = [
    {
        name: 'John',
        surname: 'Doe',
        age: 13
    },
    {
        name: 'Jane',
        surname: 'Doe',
        age: 20
    },
    {
        name: 'Homer',
        surname: 'Simpson',
        age: 50
    },
]

let fs = require('fs');
fs.writeFileSync('./stringified.json', JSON.stringify(jsonArray));

let parsedJson = JSON.parse(fs.readFileSync('stringified.json'));
for (let obj of parsedJson) {
    for (let key in obj) {
        console.log(key + ": " + obj[key]);
    }
}
