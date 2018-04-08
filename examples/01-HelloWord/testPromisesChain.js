
var a = new Promise((resolve, reject)=>{
  console.log("Running promise A")
  resolve([1,2,3,4,5]) })
}

var b= new Promise((resolve, reject)=>{
  console.log("Running promise B")
  resolve([6,7,8,9])
})

Promise.all([a,b]).then((data)=>{
  console.log(data)
})
