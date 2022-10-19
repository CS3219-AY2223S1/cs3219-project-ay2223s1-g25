import mongoose from 'mongoose';
var Schema = mongoose.Schema

let QuestionModelSchema = new Schema({
    difficulty: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
    },
    adaptedFrom: { // url to original question bank
        type: String
    }
})

export default mongoose.model('QuestionModel', QuestionModelSchema)
