const express = require('express')
const app = express()
const cors = require('cors');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const ExerciseModel = require('./models/Exercise');
const { isDateString } = require('./utils/isDateString');
require('dotenv').config()

app.use(cors())
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
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
    username: { type: String, required: true, unique: true }
    // exercises: [{ description: String, duration: Number, date: Date }],
})

const userModel = mongoose.model('userModel', userSchema);

app.post('/api/users', async (req, res) => {
    console.log(req.body);
    const newUser = new userModel({ username: req.body.username });
    newUser.save((err, data) => {
        console.log(data);
        if (data) {
            res.json({
                username: newUser.username,
                _id: newUser._id
            })
        } else {
            res.json('Username already exists')
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
        if (!user) {
            res.json({ error: 'invalid user id' });
        }
        else {
            const newExercise = new ExerciseModel({
                username: user.username,
                description: req.body.description,
                duration: req.body.duration,
                date: new Date(dateInput).toDateString()
            })
            newExercise.save((err) => {
                if (err) {
                    console.log(err)
                    res.json("User id doesn't exists");
                } else {
                    res.json({
                        _id: userId,
                        username: user.username,
                        description: newExercise.description,
                        duration: newExercise.duration,
                        date: new Date(dateInput).toDateString()
                    })
                }
            })

        }
    })
})

app.get('/api/users/:_id/logs', async (req, res) => {
    const userId = req.params._id;
    const { from = '1970-01-01', to = '2030-12-31', limit = 10 } = req.query;

    if (!isDateString(from) || !isDateString(to)) return res.status(400).send('Invalid Date Format')
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const _limit = isNaN(+limit) ? limit : +limit;

    try {
        const user = await userModel.findById(userId)
        if (!user) return res.status(404).send('User does not exist')

        const responseObj = {
            _id: userId,
            username: user.username,
            count: 0,
            log: []
        }

        if (_limit > 0) {
            const exercises = await ExerciseModel.find({ username: user.username })
                .select('description duration date -_id')
                .where('date').gte(fromDate).lte(toDate)
                .limit(_limit)
                .exec()
            responseObj.count = exercises.length
            responseObj.log = exercises.map(e => ({
                description: e.description,
                duration: e.duration,
                date: new Date(e.date).toDateString(),
            }))
        }
        return res.status(200).send(responseObj)
    } catch (error) {
        console.log(error)
        return res.status(500).send('Intenal Server Error')
    }
})


const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})

// from=2012-11-12&to=2021-11-10&limit=20
