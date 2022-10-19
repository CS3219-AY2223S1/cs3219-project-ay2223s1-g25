import express from 'express';
import cors from 'cors';
import { getQuestionByDiff, getQuestionByTopic, createQuestion } from './controller/question-controller.js';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

app.get('/', (_, res) => res.send('Hello World from question-service'))

app.get('/getQuestionByDiff', getQuestionByDiff);
app.get('/getQuestionByTopic', getQuestionByTopic);
app.post('/createQuestion', createQuestion);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "*" );
    res.header("Content-Type", "application/json")
    next();
});

app.listen(6001, () => console.log('Question-service listening on port 6001'));