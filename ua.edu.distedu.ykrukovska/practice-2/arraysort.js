/* Write на Node.js function, that receives
 * array of numbers as arguments and returns sorted array.
 * Initial cannot change */

let points = [-10, 4, 9, -2, -20, 0];
let sortedPoints = sortArray(points.slice());

console.log(points);
console.log(sortedPoints);

function sortArray(arr){
    return arr.sort((a, b) => a - b);
}
