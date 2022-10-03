const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const startSocket = require("./controllers/socket-controller.js");

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

app.get('/', (req, res) => {
    res.send('Hello World from matching-service');
});

const httpServer = createServer(app)
startSocket(httpServer);

httpServer.listen(8001);
