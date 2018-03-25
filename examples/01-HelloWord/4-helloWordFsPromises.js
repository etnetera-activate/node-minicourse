const fs = require("fs")

//dummy function
function myFunction(filename) {
  return new Promise((reject, resolve) =>{
    var str = fs.readFile(filename, (err, data) => {
      if(err) reject(err);
      else resolve(data.toString().toUpperCase())
    });
  })
}

//print it's content
console.log("--------- Start ---------")

myFunction(__filename)
  .then((data) => {
    console.log(data)
  })
  .catch( (err) => {
    console.log("ERROR:" + err)
  })

console.log("---------- End   ---------")
