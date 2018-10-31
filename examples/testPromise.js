// demo explainig Promise vs. Async/Await


//this is some function which makes something slow and complicated
function slowFunctionWithPromise(x){
    console.log("Slow function started with: "+x)
     let p = new Promise((res, rej)=>{
        setTimeout(function(){
            console.log("Slow function finished:"+x*x)
            res(x*x)
        },x*500)
    })
    console.log("End of slow function code block")
    return p
}

//you can envelope it to other Promise
function usingSlowFunctionWithPromise(x){
    return new Promise((res, rej) => {
        // do something synchronout stuff here
        let y=x+1
        // call the slow function
        slowFunctionWithPromise(y).then((data)=>{
            //do something synchronout with the result
            let z = data * 10
            res(z)
        })
    })
}

// you can do exatly the same using async/await
// this is only syntactic sugar
async function usingSlowFunctionWithAwait(x){
    let out = await slowFunctionWithPromise(x+1)
    return out * 10 // <- this is weird, but it retuns promise again!. Not value.
}

//let's use the embeding function

usingSlowFunctionWithPromise(1).then((data)=>{
    console.log("A:"+data)
})

usingSlowFunctionWithAwait(2).then((data)=>{
    console.log("B:"+data)
})

// using in bad way! You get the Promise object instead of resolved value
console.log("C:"+usingSlowFunctionWithAwait(3))