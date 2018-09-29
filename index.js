/*
 * Mock Server
 * MockServer is the easiest and quickest way to run mock APIs on server or locally and open source. Use any REST Client like postman with MOCK Server.
 * 
 * @author : Bismay <bismay@smartinfologiks.com>
 * */


const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(9005, () => console.log('Example app listening on port 9005!'))