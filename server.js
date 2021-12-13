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

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
