const express = require('express')
const app = express()
const cors = require('cors');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error...'));
connection.once('open', () => {
    console.log('database connection successful')
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    exercises: [{ description: String, duration: Number, date: Date }],
})

const userModel = mongoose.model('userModel', userSchema);

app.post('/api/users', (req, res) => {
    const newUser = new userModel({ username: req.body.username });
    newUser.save((err, data) => {
        if (err) {
            res.json('Username already exists')
        } else {
            res.json({
                username: newUser.username,
                _id: newUser._id
            })
        }
    })
})

app.get('/api/users', (req, res) => {
    userModel.find({}, (err, allusers) => {
        if (!err) {
            res.json(allusers);
        } else {
            return;
        }
    })
})

app.post('/api/users/:_id/exercises', (req, res) => {
    const userId = req.params._id;
    let dateInput;
    req.body.date ? dateInput = req.body.date : dateInput = new Date();

    userModel.findById(userId, (err, user) => {
        if(!user) {
            res.json({ error: 'invalid user id' });
        }
        else {
            user.exercises.push({
                description: req.body.description,
                duration: +req.body.duration,
                date: new Date(dateInput).toDateString()
            })
            user.save(user.exercises)
                
            res.json({
                _id: userId,
                username: user.username,
                date: new Date(dateInput).toDateString(),
                duration: +req.body.duration,
                description: req.body.description
            })
        }
    })
})

app.get('/api/users/:_id/logs', (req, res) => {
    const userId = req.params._id;
    userModel.findById(userId, (err, user) => {
        console.log(user.exercises);
        let newExerciseList = [];
        user.exercises.map(i => {
            newExerciseList = [{
                description: i.description,
                duration: i.duration,
                date: new Date(i.date).toDateString(),
                _id: userId
            }]
        })
        console.log(newExerciseList);

        if(!err) {
            res.json({ 
                username: user.username,
                count: user.exercises.length,
                _id: userId,
                log: newExerciseList
             });
        } else {
            return;
        }
    })
})

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
