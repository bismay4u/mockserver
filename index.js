/*
 * Mock Server
 * MockServer is the easiest and quickest way to run mock APIs on server or locally and open source. Use any REST Client like postman with MOCK Server.
 * 
 * @author : Bismay <bismay@smartinfologiks.com>
 * */

const config = require('./config');

/**
 * Loading all plugin packages required
 */
const restify = require('restify');
const restifyPlugins = require('restify-plugins');
const errors = require('restify-errors');

const fs = require('fs');
const bunyan = require('bunyan');
const _ = require('lodash');

//Need require-live

/**
 * Create A Logger, may be we will remove this in future
 */
const logger = bunyan.createLogger({
    name: config.name,
    streams: [{
        level: 'error',
        path: './logs/error.log' // log ERROR and above to a file
    }]
});

/**
 * Initialize Server
 */
const server = restify.createServer({
    name: config.name,
    version: config.version,

    dtrace: false,
    log: logger,
    ignoreTrailingSlash: true
});
server.config = config;

/**
 * Preeware
*/
server.pre(restify.plugins.pre.context());
server.pre(restify.plugins.pre.dedupeSlashes());
server.pre(restify.plugins.pre.sanitizePath());

/**
 * Middleware
*/
server.use(restify.plugins.urlEncodedBodyParser());
server.use(restify.plugins.queryParser({ mapParams: true }));//req.query
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.dateParser());
server.use(restify.plugins.fullResponse());
server.use(restify.plugins.gzipResponse());
server.use(restify.plugins.throttle({
                burst: 10,  // Max 10 concurrent requests (if tokens)
                rate: 0.5,  // Steady state: 1 request / 2 seconds
                ip: true,   // throttle per IP
                overrides: {
                    'localhost': {
                        burst: 0,
                        rate: 0    // unlimited
                    }
                }
            }));

server.get('/', (req, res) => {
    res.send('Hello World!')
})

server.get('/*', (req, res, next) => {
    printMockData("GET",req.path(),req, res, next);
});

server.post('/*', (req, res, next) => {
    printMockData("POST",req.path(),req, res, next);
});

server.put('/*', (req, res, next) => {
    printMockData("PUT",req.path(),req, res, next);
});

/**
 * Start Server, Checks for availale PORTs
 */
server.listen(config.port, () => {
    console.log(`${server.config.name} is listening on port ${config.port}`);
});

function printMockData(type, path, req, res, next) {
    var output = {};
    var format = "json";
    var outFormat = "json";
    var srcFile = [
            path+"."+format
        ];

    switch(type.toUpperCase()) {
        case "GET":
            srcFile.push(path+"_get."+format);
        break;
        case "POST":
            srcFile.push(path+"_post."+format);
            srcFile.push(path+"_post.js");
        break;
        case "PUT":
            srcFile.push(path+"_put."+format);
        break;
        case "DELETE":
            srcFile.push(path+"_delete."+format);
        break;
        case "OPTIONS":
            srcFile.push(path+"_options."+format);
        break;
    }
    srcFile = srcFile.reverse();

    var found = false;
    _.each(srcFile, (f,n) => {
        if(found) return;
        f1 = process.cwd() + "/mockData" + f;
        if(fs.existsSync(f1)) {
            found = true;
            ext = f1.split(".");
            ext = ext[ext.length-1];
            switch(ext.toLowerCase()) {
                case "json":
                    output = fs.readFileSync(f1,{encoding:"utf8"});
                    output = JSON.parse(output);
                break;
                case "js":
                   try {
                        output = require(f1)(server, req, res);
                   } catch(e) {
                        output = require(f1);
                   }
                break;
            }
        }
    });

    if(req.query.debug=="true") {
        // output = _.merge(output,{
        //     "type":type.toUpperCase(),
        //     "path": path,
        //     "src": srcFile
        // });
        output = {
            "type":type.toUpperCase(),
            "path": path,
            "src": srcFile,
            "data":output
        }
    }

    if(req.query.format != null && req.query.format.length>0) {
        outFormat = req.query.format.toLowerCase();
    }

    switch(outFormat) {
        case "xml":
            output = "<xml>WIP</xml>";
            res.send(output);
        break;
        case "text":
        case "raw":
            output = "WIP";
            res.send(output);
        break;
        case "json":
        default:
            res.send(output);
        break;
    }

    next();
}