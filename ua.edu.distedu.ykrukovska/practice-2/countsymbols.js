/* Write functions that receives a string and returns structure that contains count of occurrence of
every symbol in the given string. Use associative arrays */

function countSymbols(word) {
    let result = {};

    for (let i = 0; i < word.length; i++) {
        let symbol = word.charAt(i);
        result[symbol] = (isNaN(result[symbol]) ? 1 : result[symbol] + 1);
    }

    return result;
}

let testString = 'abcdbcdcdd';
console.log(countSymbols(testString));
