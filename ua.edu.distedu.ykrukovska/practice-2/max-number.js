/* Write function that receives array and returns max element.
 * 1) procedure style: based on for loop
 * 2) functional style: using function Array.reduce()
 */

function findMaxProcedureStyle(array) {
    let max = array[0];

    for (let number of array) {
        if (number > max) {
            max = number;
        }
    }

    return max;
}

function findMaxFunctionalStyle(array) {
    return array.reduce((x, y) => (x > y) ? x : y)
}

let arr = [-2, 90, -3, 100, -2, 0];

console.log(findMaxProcedureStyle(arr.slice()));
console.log(findMaxFunctionalStyle(arr.slice()));
