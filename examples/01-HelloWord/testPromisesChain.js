
var a = new Promise((resolve, reject)=>{resolve([1,2,3,4,5]) })

var b= new Promise((resolve, reject)=>{resolve([6,7,8,9]) })

Promise.all([a,b]).then((data)=>{
  console.log(data)
  console.log(data.concat())
})
