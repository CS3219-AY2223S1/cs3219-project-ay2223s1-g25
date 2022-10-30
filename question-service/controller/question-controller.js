import { ormCreateQuestion as _createQuestion, 
    ormGetQuestionByDiff as _getQuestionByDiff, 
    ormGetQuestionByTopic as _getQuestionByTopic } from '../model/question-orm.js'

import { createClient } from 'redis';
let redisClient = createClient();
(async () => { await redisClient.connect(); })();

const subscriber = redisClient.duplicate();
await subscriber.connect();
await subscriber.subscribe('matched', async (message) => {
    message = JSON.parse(message);
    var roomId = message.roomId;
    var difficulty = message.difficulty;

    // Call function to get a question
    var question = await getQuestionByDiff(roomId, difficulty);
});

export async function getQuestionByRoom(req, res) {
    // Get question from Redis
    try {
        var roomQuestionCache = await redisClient.get(req.query.roomId);
        if (roomQuestionCache) {
            var results = JSON.parse(roomQuestionCache);
            return res.status(200).json({ message: 'Retrieved question successfully!', body: results });
        } else {
            return res.status(400).json({ message: 'An error occurred!' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Database failure when finding a question by difficulty!', error: err });
    }
}

export async function createQuestion(req, res) {
    try {
        const questionId = req.body.questionId;
        const title = req.body.title;
        const content = req.body.content;
        const difficulty = req.body.difficulty.toLowerCase();
        const categoryTitle = req.body.categoryTitle;

        if (questionId && difficulty && title && content && categoryTitle) {
            const resp = await _createQuestion(questionId, title, content, difficulty, categoryTitle);
            
            if (resp.err) {
                return res.status(400).json({message: 'Could not create a new question!'});
            } else {
                console.log(`Created new question: ${title}, successfully!`)
                return res.status(201).json({message: `Created new question: ${title}, successfully!`});
            }
        } else {
            return res.status(400).json({message: 'Title and/or content and/or difficulty and/or questionId are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new question!'})
    }
}

async function getQuestionByDiff(roomId, difficulty) {
    try {
        const results = await _getQuestionByDiff(difficulty);
        console.log(results);
        redisClient.setEx(roomId, 3600, JSON.stringify(results));

        if (results.err) {
            return { message: 'Could not find a question by difficulty!' };
        } else {
            return { message: `Retrieved question successfully!`, body: results };
        }
    } catch (err) {
        return { message: 'Database failure when finding a question by difficulty!', error: err };
    }
}

async function getQuestionByTopic(req, res) {
    try {
        const topic = req.query.topic;
        const resp = await _getQuestionByTopic(topic);
        
        if (resp.err) {
            return res.status(400).json({message: 'Could not find a question by topic!'});
        } else {
            return res.status(200).json({message: `Retrieved question ${resp.title}, successfully!`, body: resp});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when finding a question by topic!'})
    }
}
