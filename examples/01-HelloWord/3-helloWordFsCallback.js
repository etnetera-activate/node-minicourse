const fs = require("fs")

//dummy function
function myFunction(filename) {
  var str = fs.readFile(filename, (err, data) => {
    if(err) throw err;
    printData(data.toString().toUpperCase())
  });
}

function printData(data){
  console.log(data)
}

//print it's content
console.log("--------- Start ---------")
myFunction(__filename)
console.log("---------- End   ---------")
