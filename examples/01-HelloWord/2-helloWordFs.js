const fs = require("fs")  //require module filesystem

//dummy function
function myFunction(filename) {
  var str = fs.readFileSync(filename);
  return str.toString().toUpperCase();
}

//print it's content
console.log(" --------- Start ---------")
console.log(myFunction(__filename))
console.log("---------- End   ---------")
