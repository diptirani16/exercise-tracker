const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    username: String,
    description: String,
    duration: Number,
    date: Date
})

// exerciseSchema.set('toObject', {
//     virtuals: false,
//     transform: (doc, ret, options) => {
//         delete ret._v;
//         ret.date = new Date(ret.date).toDateString();
//     }
// })

module.exports = mongoose.model('ExerciseModel', exerciseSchema);
