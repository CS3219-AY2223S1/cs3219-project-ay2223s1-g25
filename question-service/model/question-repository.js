import 'dotenv/config'
import QuestionModel from './question-model.js';

//Set up mongoose connection
import mongoose from 'mongoose';
import fs from 'fs';

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', _ => { 
    console.log('Database connected:', mongoDB);
    QuestionModel.find({}, function(err, docs) {
        if (err) { 
            throw err;
        } else {
            if(docs.length == 0) {
                console.log("Question database is empty, populating questions now!");
                let rawdata = fs.readFileSync('./seed.json');
                let data = JSON.parse(rawdata);
                QuestionModel.collection.insertMany(data, function(err,r) {
                    if (err) {
                        throw err;
                    }
                    if (r.insertedCount == data.length) {
                        console.log("All questions has been populated!");
                    } else if (r.insertedCount == 0) {
                        throw Error("Unable to populate database!");
                    }
                });
            } else {
                console.log("Question database populated, not populating...");
            }
        }
    });
 });

export async function createQuestion(questionId, title, content, difficulty, categoryTitle) { 
    return new QuestionModel(questionId, title, content, difficulty, categoryTitle);
}

export async function getQuestionByDifficulty(difficulty) { 
    // Get count of all questions matching difficulty
    var count = await QuestionModel.countDocuments({ difficulty: difficulty }).exec();

    // Get random entry
    var random = Math.floor(Math.random() * count);
    return await QuestionModel.findOne({ difficulty: difficulty }, null, { skip: random }).exec();
}

export async function getQuestionByTopic(topic) { 
        // Get count of all questions matching topic
        var count = await QuestionModel.countDocuments({ topic: topic }).exec();

        // Get random entry
        var random = Math.floor(Math.random() * count);
        return await QuestionModel.findOne({ topic: topic }, null, { skip: random }).exec();
}