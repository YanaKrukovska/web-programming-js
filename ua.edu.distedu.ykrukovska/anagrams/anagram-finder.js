function readFile(input) {
    const fs = require("fs");
    const text = fs.readFileSync(input).toString('utf-8');
    return text.split(/\s+/);
}

function sortLetters(word) {
    return word.split('').sort().join('');
}

function writeAnagrams(anagrams) {
    for (let key in anagrams) {
        if (anagrams.hasOwnProperty(key) && anagrams[key].length > 1) {
            let values = anagrams[key];
            let res = "";
            for (let i = 0; i < values.length; i++) {
                res += i === values.length - 1 ? values[i] : values[i] + " - ";
            }
            console.log(res);
        }
    }
}

function findAnagrams(fileName) {
    let words = readFile(__dirname + fileName);
    let anagrams = [];

    for (let word of words) {
        let sortedWord = sortLetters(word);
        anagrams[sortedWord] = anagrams[sortedWord] || []
        anagrams[sortedWord].push(word)
    }

    return anagrams;
}

writeAnagrams(findAnagrams("/anagrams.txt"));
