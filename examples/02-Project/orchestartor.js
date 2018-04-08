'use strict'

const debug = require("debug")("slack:orchestrator")
const slackAPI = require("./slackAPI.js")

debug("Orchestrator started")
setInterval(function() {
  slackAPI.getLargeOldFiles(10,90).then(files => {
     debug("Orchestartor found:"+files.length)

  });
}, 10 * 1000);
