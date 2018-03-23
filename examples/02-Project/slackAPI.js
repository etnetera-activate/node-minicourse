
const cfg = require("./config.js");

const debug = require("debug")("slackAPI");
const axios = require("axios");
var moment = require("moment");

var client = axios.create({
  baseURL: 'https://slack.com/api/',
  timeout: 5000,
  headers: {'Authorization': 'Bearer '+cfg.slack.token}
});

function getAllFiles(){
  return new Promise((resolve,reject)=>{
    debug("starting download")
    client.get('files.list?count=100').then(response => {
        return response.data.paging
      }).then((paging)=>{
        debug("There is %d pages",paging.pages)
        var requests = []
        for(var i = 1 ; i <= paging.pages ; i++){
          var request = client.get("files.list?count=100&page="+i)
            .then((result => {
              debug("%O",result.data.paging)
              return(result.data.files)
            }))

          requests.push(request);
        }
        Promise.all(requests).then((results)=>{
          var files = [].concat.apply([], results); //flatten array of arrays
          resolve(files)
        })
    })
  })
}

function deleteFile(fileId){
  return new Promise((resolve, reject) => {
    client.get("files.delete?file="+fileId).then((result => {
      debug(`Delete file ${fileId} : ${result}`)
      resolve(result);
    }))
  })
}

function shallBeDeleted(obj){
  return (obj.size >= 5)&&(obj.age >=180)
}

getAllFiles()
  .then((data)=>{
    debug("LENGTH: "+data.length)
    var files = data.map((obj)=>{
      var fileDate = moment(obj.timestamp*1000).format("YYYY-MM-DD");
      var today = moment();
      var duration = moment.duration(today.diff(fileDate));
      var ageDays = duration.asDays();

      return {
        id: obj.id,
        name: obj.name + " ("+obj.title+")",
        date:fileDate,
        age: ageDays,
        size: obj.size / (1024*1024),
        mode: obj.mode,
        mimeType: obj.mimetype
      }
    })
    debug(files.filter(shallBeDeleted))
  })
  .catch((e)=>{
    debug(e)
  })

//deleteFile("F9VQNUKK8").then((res => debug(res)))
