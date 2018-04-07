'use strict'

const cfg = require("./config.js");

const debug = require("debug")("activate:slackapi");
const axios = require("axios");
var moment = require("moment");

const filesPerPageCount = 100

module.exports = {
    getLargeOldFiles: getOldLargeFiles
}


var client = axios.create({
    baseURL: 'https://slack.com/api/',
    timeout: 10000,
    headers: { 'Authorization': 'Bearer ' + cfg.slack.token }
});


//eslint-disable-next-line no-unused-vars
function deleteFile(fileId) {
    return new Promise((resolve, reject) => {
        client.get("files.delete?file=" + fileId).then((result => {
            debug(`Delete file ${fileId}`)
            resolve(result.data);
        })).catch(e => { reject(e) })
    })
}

function getOldLargeFiles(minSize = 10, minAge = 90) {
    return new Promise((resolve, reject) => {
        client.get(`files.list?count=${filesPerPageCount}`)
            .then(response => {
                var paging = response.data.paging;
                debug("There is %d pages of files", paging.pages)
                var requests = []
                for (var i = 1; i <= paging.pages; i++) {
                    var request = client.get(`files.list?count=${filesPerPageCount}&page=${i}`)
                    requests.push(request);
                }
                return Promise.all(requests)
            })
            .then((results) => {
                var files = results.map(obj => { return obj.data.files })
                files = files.reduce((acc, val) => acc.concat(val), [])
                return (files)
            })
            .then((files) => {
                debug("Num of files: " + files.length)
                return files.map((obj) => {
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
            })
            .then((mappedFiles) => {
                var out = mappedFiles.filter(obj => (obj.size >= minSize) && (obj.age >= minAge));
                out = out.sort((obj1, obj2) => { return obj2.size - obj1.size })


                var totalSize = out.map(obj => { return obj.size }).reduce((total, num) => { return total + num })
                debug("Found %d files with total size %d MB", out.length, Math.ceil(totalSize));
                return (out);
            })
            .then(out => { resolve(out) })
            .catch(e => { reject(e) })
    })
}