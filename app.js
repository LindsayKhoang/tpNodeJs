const path = require('path');
const dayjs = require('dayjs');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const twig = require('twig').twig; // ('twig')=Module, "().twig"=render function

// TODO: declare mongoose models
// TODO: connect to mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://lindsay:lindsay@cluster0.6ebyi.mongodb.net/test', {useNewUrlParser: true, useUnifiedTopology: true });

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
*/
/*
    let message1 = new Message({ username: 'Olivier', date: dayjs().subtract(1, 'minutes'), room: 'globale', content: 'Bonjour à tous' });
    let message2 = new Message({ username: 'Florent', date: dayjs().subtract(2, 'minutes'), room: 'globale', content: 'Bonjour' });
    let message3 = new Message({ username: 'Stephan', date: dayjs().subtract(3, 'minutes'), room: 'globale', content: 'Bonjour' });
    let message4 = new Message({ username: 'Lindsay', date: dayjs().subtract(4, 'minutes'), room: 'globale', content: 'Bonjour' });
    let message5 = new Message({ username: 'Olivier', date: dayjs().subtract(5, 'minutes'), room: 'globale', content: 'On va commencer le cours, accrochez-vous' });
    let message6 = new Message({ username: 'Florent', date: dayjs().subtract(6, 'minutes'), room: 'globale', content: 'Allez !' });
    message1.save();
    message2.save();
    message3.save();
    message4.save();
    message5.save();
    message6.save();
    let message7 = new Message({ username: 'Olivier', date: dayjs().subtract(1, 'minutes'), room: 'dev', content: 'Bonjour à tous' });
    let message8 = new Message({ username: 'Florent', date: dayjs().subtract(2, 'minutes'), room: 'dev', content: 'Bonjour' });
    let message9 = new Message({ username: 'Stephan', date: dayjs().subtract(3, 'minutes'), room: 'dev', content: 'Bonjour' });
    let message10 = new Message({ username: 'Lindsay', date: dayjs().subtract(4, 'minutes'), room: 'dev', content: 'Bonjour' });
    message7.save();
    message8.save();
    message9.save();
    message10.save();
*/
    var roomNames = [];
    var messages = [];
/*
	function getMessages(room) {
		messages = [];
        Message.find({room: room},function(err, message) {
            for(var i=0; i < message.length; i++)
            {
                messages[i] = message[i];
            }
        });
		return messages;
	}
*/
    setTimeout(function(){
        Room.find({},function(err, room) {
            for(var i=0; i < room.length; i++)
            {
                roomNames[i] = room[i].name;
            }
        });

        Message.find({room: 'globale'},function(err, message) {
            for(var i=0; i < message.length; i++)
            {
                messages[i] = message[i];
            }
        });
		return messages;
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
                res.json({result: roomNames});
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
                let userName = req.body.userName;
                let messagex = new Message({ username: userName, date: dayjs(), room: roomName, content: content });
                messagex.save().then(messages.push(messagex));
                // TODO: replace by a real query to mongoose:
                res.json({
                    result: [messagex]
                });
            })
            .listen(3000);
    }, 3000);
