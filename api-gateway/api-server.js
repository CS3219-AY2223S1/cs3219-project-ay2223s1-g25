const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const helmet = require("helmet");
const {expressjwt: jwt} = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const config = require("./config.json");

const app = express();

const port = process.env.API_PORT || 3001;
const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = config.appOrigin || `http://localhost:${appPort}`;
const collabService = config.collabService || `http://localhost:4001`;
const chatService = config.chatService || `http://localhost:5001`;
const questionService = config.questionService || `http://localhost:6001`;
const matchingService = config.matchingService || `http://localhost:8001`;

const collabServiceProxy = createProxyMiddleware({ target: collabService, ws: true, pathRewrite: {'^/api/collab' : ''} });
const chatServiceProxy = createProxyMiddleware({ target: chatService, ws: true, pathRewrite: {'^/api/chat' : ''} });
const questionServiceProxy = createProxyMiddleware({ target: questionService, ws: true, pathRewrite: {'^/api/question' : ''} });
const matchingServiceProxy = createProxyMiddleware({ target: matchingService, ws: true, pathRewrite: {'^/api/matching' : ''} });

if (
  !config.domain ||
  !config.audience 
) {
  console.log(
    "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
  );

  process.exit();
}

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));

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

app.use("/api/collab", checkJwt, collabServiceProxy);
app.use("/api/chat", checkJwt, chatServiceProxy);
app.use("/api/question", checkJwt, questionServiceProxy);
app.use("/api/matching", checkJwt, matchingServiceProxy);

app.get("/", (req, res) => {
  res.send({
    msg: "You have reached PeerPrep API Server.",
  });
});

app.listen(port, () => console.log(`API Server listening on port ${port}`));
