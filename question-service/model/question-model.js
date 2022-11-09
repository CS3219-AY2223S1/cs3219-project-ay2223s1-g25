import mongoose from 'mongoose';
var Schema = mongoose.Schema

let QuestionModelSchema = new Schema({
    questionId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    categoryTitle: {
        type: String,
        required: true,
    },
    hints: {
        type: String
    }
})

export default mongoose.model('QuestionModel', QuestionModelSchema)
