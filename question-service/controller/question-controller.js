import 'dotenv/config'
import { ormCreateQuestion as _createQuestion, 
    ormGetQuestionByDiff as _getQuestionByDiff } from '../model/question-orm.js'

import { createClient } from 'redis';
let redisClient;

(async () => { 
    redisClient = createClient({
        socket: {
            host: process.env.REDIS_REMOTE_HOST,
            port: process.env.REDIS_REMOTE_PORT,
        },
        password: process.env.REDIS_REMOTE_PASSWORD
    });
    
    await redisClient.connect(); 
    const subscriber = redisClient.duplicate();
    await subscriber.connect();
    await subscriber.subscribe('matched', async (message) => {
        message = JSON.parse(message);
        let roomId = message.roomId;
        let difficulty = message.difficulty;
        let categoryTitle = message.categoryTitle;
        console.log("Creating "+ difficulty + " question for " + roomId);
        await generateQuestionByDiff(roomId, difficulty, categoryTitle);
    });
})();

export async function getQuestionByRoom(req, res) {
    // Get question from Redis
    try {
        let roomQuestionCache = await redisClient.get(req.query.roomId);
        if (roomQuestionCache) {
            let results = JSON.parse(roomQuestionCache);
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

async function generateQuestionByDiff(roomId, difficulty, categoryTitle) {
    try {
        const results = await _getQuestionByDiff(difficulty, categoryTitle);
        console.log(results);
        redisClient.setEx(roomId, 3600, JSON.stringify(results));
    } catch (err) {
        console.error("Error generating question:" + err);
    }
}