'use strict'

const cfg = require("./config.js");

const debug = require("debug")("slack:api");
const axios = require("axios");
var moment = require("moment");

const filesPerPageCount = 100

module.exports = {
    getAllSlackFiles: getAllSlackFiles,
    getLargeOldFiles: getLargeOldFiles
}

var client = axios.create({
    baseURL: 'https://slack.com/api/',
    timeout: 10000,
    headers: { 'Authorization': 'Bearer ' + cfg.slack.token }
});

function getAllSlackFiles() {
    return new Promise((resolve, reject) => {
        debug("Getting all files from SLACK API..")
        client.get(`files.list?count=${filesPerPageCount}`).then(response => {
            var paging = response.data.paging;
            debug("There is %d pages of files", paging.pages)
            var requests = []
            for (var i = 1; i <= paging.pages; i++) {
                var request = client.get(`files.list?count=${filesPerPageCount}&page=${i}`)
                requests.push(request);
            }
            return Promise.all(requests)
        }).then((results) => {
            var files = results.map(obj => { return obj.data.files })
            files = [].concat.apply([], files); //flatten array of arrays
            resolve(files)
        }).catch(e => { reject(e) })
    })
}


function getLargeOldFiles(minSize = 5, minAge = 90) {
    return getAllSlackFiles()
        .then((data) => {
            debug("LENGTH: " + data.length)
            var files = data.map((obj) => {

                var fileDate = moment(obj.timestamp * 1000).format("YYYY-MM-DD");
                var today = moment();
                var duration = moment.duration(today.diff(fileDate));
                var ageDays = duration.asDays();

                return {
                    id: obj.id,
                    name: obj.name + " (" + obj.title + ")",
                    date: fileDate,
                    age: ageDays,
                    size: obj.size / (1024 * 1024),
                    mode: obj.mode,
                    mimeType: obj.mimetype,
                }
            })
            var out = files.filter(obj => (obj.size >= minSize) && (obj.age >= minAge));
            return (out);
        })
}

//eslint-disable-next-line no-unused-vars
function deleteFile(fileId) {
    return new Promise((resolve, reject) => {
        client.get("files.delete?file=" + fileId).then((result => {
            debug(`Delete file ${fileId}`)
            resolve(result.data);
        })).catch(e => { reject(e) })
    })
}

//TEST
getLargeOldFiles(5, 90).then((res) => { debug(res) })

//deleteFile("F9VQNUKK8").then((res => debug(res)))