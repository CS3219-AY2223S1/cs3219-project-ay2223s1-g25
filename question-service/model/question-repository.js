import 'dotenv/config'
import QuestionModel from './question-model.js';

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', _ => { console.log('Database connected:', mongoDB) })

export async function createQuestion(questionId, title, content, difficulty, categoryTitle) { 
    return new QuestionModel(questionId, title, content, difficulty, categoryTitle);
}

export async function getQuestionByDifficulty(difficulty, categoryTitle) { 
    var cond;
    if (categoryTitle === "") {
        cond = { difficulty: difficulty }
    } else if (difficulty === "") {
        cond = { categoryTitle: categoryTitle }
    } else {
        cond = { difficulty: difficulty, categoryTitle: categoryTitle }
    }
    
    // Get count of all questions matching difficulty and/or category
    var count = await QuestionModel.countDocuments(cond).exec();

    // Get random entry
    var random = Math.floor(Math.random() * count);
    return await QuestionModel.findOne(cond, null, { skip: random }).exec();
}