const path = require('path');
const dayjs = require('dayjs');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const twig = require('twig').twig; // ('twig')=Module, "().twig"=render function

// TODO: declare mongoose models
// TODO: connect to mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true });

    let userJSON = new mongoose.Schema({
        pseudo: { type: String, unique: true },
    });
    let roomJSON = new mongoose.Schema({
        name: { type: String, unique: true }
    });
    let messageJSON = new mongoose.Schema({
        username: { type: String, ref: 'User'},
        date: { type : Date, default: Date.now },
        room: { type: String, ref: 'Room'},
        content: String
    });
    const User = mongoose.model('user', userJSON);
    const Room = mongoose.model('room', roomJSON);
    const Message = mongoose.model('message', messageJSON);
/*
    let room1 = new Room({name: 'globale'});
    room1.save();
    let room2 = new Room({name: 'dev'});
    room2.save();
    let room3 = new Room({name: 'msi2020'});
    room3.save();

    let message1 = new Message({ username: 'Zildjian', date: dayjs().subtract(1, 'minutes'), room: 'globale', content: 'Coucou' });
    let message2 = new Message({ username: 'Zildjian', date: dayjs().subtract(2, 'minutes'), room: 'globale', content: 'Coucou' });
    let message3 = new Message({ username: 'Zildjian', date: dayjs().subtract(3, 'minutes'), room: 'globale', content: 'Coucou' });
    let message4 = new Message({ username: 'Zildjian', date: dayjs().subtract(4, 'minutes'), room: 'globale', content: 'Coucou' });
    let message5 = new Message({ username: 'Zildjian', date: dayjs().subtract(5, 'minutes'), room: 'globale', content: 'Coucou' });
    let message6 = new Message({ username: 'Zildjian', date: dayjs().subtract(6, 'minutes'), room: 'globale', content: 'Coucou' });
    message1.save();
    message2.save();
    message3.save();
    message4.save();
    message5.save();
    message6.save();*/

    var roomNames = [];
    var messages = [];

    setTimeout(function(){
        Room.find({},function(err, room) {
            for(var i=0; i < room.length; i++)
            {
                roomNames[i] = room[i].name;
            }
        });

        Message.find({},function(err, message) {
            for(var i=0; i < message.length; i++)
            {
                messages[i] = message[i];
            }
        });
        Message.find({}).exec().then(message => {console.log(message)});
        }, 1000);


    setTimeout(function(){
        let app = express()
            .use(compression())
            .use(bodyParser.json()) // support json encoded bodies
            .use(bodyParser.urlencoded({extended: true})) // support encoded bodies
            .use('/static', express.static(path.join(__dirname, '/static')))
            .use(express.static(__dirname + '/views'))
            /* hard-coded served file: favicon.ico */
            .get('/favicon.ico', function (req, res) {
                res.sendFile('favicon.ico', {root: path.join(__dirname, '/static')})
            })
            .get('/rooms', function (req, res) {
                // TODO: fill an array with rooms found in database:
                res.json({result: Room.find({})});
                // res.json({result: roomNames});
                // res.json({result: ["globale", "dev", "msi 2020"]});
                // test: res.json({message: "Critical error"});
            })
            .get('/', function (req, res) {
                res.render('index.twig', {
                    message: "Bonjour je suis le test"
                });
            })
            .post('/room/:roomName/join', function (req, res, next) {
                let roomName = req.params.roomName;
                let userName = req.body.username;
                // TODO: check that roomName exists:
                // test: res.json({message: "Critical error"});
                // TODO: if userName doesn't exist, create it:
                if (!userName) {
                    res.json({message: "Username is empty!"});
                    return;
                }
                // TODO: replace by a real query to mongoose:
                res.json({
                    result: messages
                });
            })
            .post('/room/:roomName/messages', function (req, res, next) {
                let roomName = req.params['roomName'];
                let content = req.body.content;
                let messagex = new Message({ username: 'test', date: dayjs(), room: roomName, content: content });
                messagex.save().then(messages.push(messagex));
                // TODO: replace by a real query to mongoose:
                res.json({
                    result: [messagex]
                });
            })
            .listen(3000);
    }, 3000);