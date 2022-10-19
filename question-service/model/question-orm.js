import { createQuestion, getQuestionByDifficulty, getQuestionByTopic } from './question-repository.js';

export async function ormCreateQuestion(difficulty, title, description, topic, url) {
    try {
        const newQuestion = await createQuestion({difficulty, title, description, topic, url});
        newQuestion.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new question!');
        return { err };
    }
}

export async function ormGetQuestionByDiff(difficulty) {
    try {
        const question = await getQuestionByDifficulty(difficulty);
        return question;
    } catch (err) {
        console.log('ERROR: Could not get question by difficulty!');
        return err;
    }
}

export async function ormGetQuestionByTopic(topic) {
    try {
        const question = await getQuestionByTopic(topic);
        return question;
    } catch (err) {
        console.log('ERROR: Could not get question by topic!');
        return err;
    }
}