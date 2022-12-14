import { createQuestion, getQuestionByDifficulty, getAllQuestions } from './question-repository.js';

export async function ormCreateQuestion(questionId, title, content, difficulty, categoryTitle) {
    try {
        const newQuestion = await createQuestion({questionId, title, content, difficulty, categoryTitle});
        newQuestion.save();
        return newQuestion;
    } catch (err) {
        console.log('ERROR: Could not create new question!');
        return { err };
    }
}

export async function ormGetQuestionByDiff(difficulty, categoryTitle) {
    try {
        const question = await getQuestionByDifficulty(difficulty, categoryTitle);
        return question;
    } catch (err) {
        console.log('ERROR: Could not get question by difficulty!');
        return err;
    }
}

export async function ormGetAllQuestions() {
    try {
        const questions = await getAllQuestions();
        return questions;
    } catch (err) {
        console.log('ERROR: Could not get all questions!');
        return err;
    }
}