import { ormCreateQuestion as _createQuestion, 
    ormGetQuestionByDiff as _getQuestionByDiff, 
    ormGetQuestionByTopic as _getQuestionByTopic } from '../model/question-orm.js'

import { createClient } from 'redis';
let redisClient = createClient();
(async () => { await redisClient.connect(); })();

export async function createQuestion(req, res) {
    try {
        const difficulty = req.body.difficulty;
        const title = req.body.title;
        const description = req.body.description;
        const topic = req.body.topic;
        const url = req.body.url;

        if (difficulty && title && description) {
            const resp = await _createQuestion(difficulty, title, description, topic, url);
            console.log(resp);
            
            if (resp.err) {
                return res.status(400).json({message: 'Could not create a new question!'});
            } else {
                console.log(`Created new question: ${title}, successfully!`)
                return res.status(201).json({message: `Created new question: ${title}, successfully!`});
            }
        } else {
            return res.status(400).json({message: 'Title and/or Description and/or Difficulty are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new question!'})
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
export async function getQuestionByDiff(req, res) {
    try {
        await sleep(Math.random() * 3000);
        console.log("DONE SLEEP");
        var roomQuestionCache = await redisClient.get(req.query.roomId);
        if (roomQuestionCache) {
            console.log("IN CACHE!");
            var results = JSON.parse(roomQuestionCache);
            console.log(results);
            return res.status(200).json({message: `Retrieved question successfully!`, body: results});
        } else {
            console.log("NOT IN CACHE!");
            const difficulty = req.query.difficulty;
            const resp = await _getQuestionByDiff(difficulty);
            redisClient.setEx(req.query.roomId, 3600, JSON.stringify(resp));

            if (resp.err) {
                return res.status(400).json({message: 'Could not find a question by difficulty!'});
            } else {
                return res.status(200).json({message: `Retrieved question successfully!`, body: resp});
            }
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when finding a question by difficulty!'})
    }
}

export async function getQuestionByTopic(req, res) {
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
