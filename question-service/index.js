import express from 'express';
import cors from 'cors';
import { getQuestionByRoom, createQuestion, getAllQuestions } from './controller/question-controller.js';
import {expressjwt as jwt} from "express-jwt";
import jwksRsa from "jwks-rsa";

import { readFile } from 'fs/promises';
const config = JSON.parse(
  await readFile(
    new URL('./config.json', import.meta.url)
  )
);

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

const catchUnauthorizedError = function(err, req, res, next) {
  if(err.name === 'UnauthorizedError') {
    res.status(err.status).send({message:err.message});
    return;
  }
  next();
}

const checkGrantType = function(req, res, next) {
  if(req.auth.gty !== 'password') {
    res.status(401).send({message:"Invalid grant type!"});
    return;
  }
  next();
}

app.get('/', (_, res) => res.send('Hello World from question-service'))

app.get('/getQuestionByRoom', getQuestionByRoom);
app.post('/createQuestion', checkJwt, catchUnauthorizedError, checkGrantType, createQuestion);
app.get('/getAllQuestions', checkJwt, catchUnauthorizedError, checkGrantType, getAllQuestions);

app.listen(6001, () => console.log('Question-service listening on port 6001'));

export default app;