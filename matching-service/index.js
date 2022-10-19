const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const {startSocket, getRoom} = require("./controllers/socket-controller.js");
const {expressjwt: jwt} = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const config = require("./config.json");

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${config.domain}/.well-known/jwks.json`,
    }),
  
    audience: config.audience,
    issuer: `https://${config.domain}/`,
    algorithms: ["RS256"],
  });
  

app.get('/', (req, res) => {
    res.send('Hello World from matching-service');
});

app.get('/room', checkJwt, getRoom);

const httpServer = createServer(app)
startSocket(httpServer);

httpServer.listen(8001);
