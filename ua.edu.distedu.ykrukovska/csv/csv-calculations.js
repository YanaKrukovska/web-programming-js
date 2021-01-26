module.exports = {
    sortInitialOrder: function (array) {
        return array.sort((a, b) => a.id - b.id);
    },

    sortAscending: function (array) {
        return array.sort((a, b) => a.average - b.average);
    },

    sortDescending: function (array) {
        return array.sort((a, b) => b.average - a.average);
    },

    calculateAverage: function (grades) {
        let sum = 0;
        for (let i = 0; i < grades.length; i++) {
            sum += parseInt(grades[i], 10);
        }

        return sum / grades.length;
    },

    readFile: function () {
        let grades = [];
        const fs = require("fs");
        const text = fs.readFileSync('csv-data.txt').toString('utf-8');
        let lines = text.split(/\r\n/);

        for (let i = 0; i < lines.length - 1; i++) {
            let splitGrades = lines[i].split(/;/);

            grades.push({
                "id": i,
                "first": splitGrades[0],
                "second": splitGrades[1],
                "third": splitGrades[2],
                "average": this.calculateAverage(splitGrades),
            });
        }

        return grades;
    }
}
