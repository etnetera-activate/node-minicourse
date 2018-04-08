'use strict'

var cfg = require("./config.js")
var logger = cfg.logger
const slack = require("./slackAPI.js")
var debug = require("debug")("slack:index")

const express = require('express')
const app = express()

//middelware
var loggerMiddelware = function(req, res, next) {
    logger.info(`[REQUEST] ${req.originalUrl}`)
    next();
}
app.use(loggerMiddelware);
app.set('view engine', 'pug')

app.get('/slack/files/all', (req, res) => {
    slack.getAllSlackFiles().then(files => { res.json(files) })
})

app.get('/slack/files/filter/:size/:age', (req, res) => {
    var size = req.params['size']
    var age = req.params['age']
    debug(`Getting  files >${size} MB an >${age} days`);
    slack.getLargeOldFiles(size, age).then(files => { res.json(files) })
})

app.get('/slack/files/filter/:size/:age/html', function(req, res) {
    var size = req.params['size']
    var age = req.params['age']
    slack.getLargeOldFiles(size, age).then(files => {
        res.render('index', {
            header: `Files >${size}MB and older than ${age} days`,
            files: files
        })
    })
})


var port = 35000
app.listen(port, () => {
    logger.info('Example app listening on port: ' + port);
})