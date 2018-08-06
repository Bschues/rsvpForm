const mongoose = require('mongoose');
const express = require('express');

const app = express();
const port = 3000 
const url = "mongodb://localhost:27017/rsvp"

app.use(express.static('./public'));
app.use(express.urlencoded());
app.set('views', './views');
app.set('view engine', 'pug');

mongoose.connect(url)
const rsvp = mongoose.connection;
rsvp.on('error', console.error.bind(console, 'connection error'))
rsvp.once('open', function() {
    console.log('live')
})

const eventRsvpSchema = mongoose.Schema({
    name: String,
    email: String,
    attending: String,
    numberOfGuests: Number
});

const Guest = mongoose.model('Guest', eventRsvpSchema)

app.get('/', (req, res) => {
    res.render('rsvpForm')
})

app.post('/completedForm', (req, res) => {
    let newGuest = new Guest({
        name: req.body.guestName,
        email: req.body.guestEmail,
        attending: req.body.attending,
        numbOfGuests: req.body.numberOfGuests
    })

    newGuest.save(function(err) {
        if (err) throw err;
        console.log('~Guest saved successfully~');
    })

    res.render('completedForm');
})

app.get('/guestList', (req,res) => {
    let attendingNames = [];
    Guest.find(function(err, newGuest) {
        if (err) return console.error(err)
        console.log(newGuest)
        res.render('guestlist', ({newGuest}))

    })
})





app.listen(port)