import { ormCreateQuestion as _createQuestion, 
    ormGetQuestionByDiff as _getQuestionByDiff, 
    ormGetQuestionByTopic as _getQuestionByTopic } from '../model/question-orm.js'

export async function createQuestion(req, res) {
    try {
        const { difficulty, title, description, topic, url } = req.body;

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

export async function getQuestionByDiff(req, res) {
    try {
        const difficulty = req.query.difficulty;
        const resp = await _getQuestionByDiff(difficulty);
        
        if (resp.err) {
            return res.status(400).json({message: 'Could not find a question by difficulty!'});
        } else {
            return res.status(200).json({message: `Retrieved question ${resp.title}, successfully!`, body: resp});
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

// module.exports = ;