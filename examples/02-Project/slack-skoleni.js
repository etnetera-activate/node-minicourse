'use strict'

const cfg = require("./config.js");

const debug = require("debug")("activate:slackapi");
const axios = require("axios");

const filesPerPageCount = 100


var client = axios.create({
    baseURL: 'https://slack.com/api/',
    headers: { 'Authorization': 'Bearer ' + cfg.slack.token }
});


function getSlackFiles() {
    return client.get(`files.list?count=${filesPerPageCount}`)
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

}

debug("Start")
getSlackFiles()
    .then(files => debug(files))
    .catch(e => debug("ERROR: %O", e))