'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// weird that you have one handler in a different file, but not the rest of them... very inconsistent.
const getZen = require('./handlers/zen');
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const User = require('./models/User');
// why did you disable this warning instead of just deleting the line?

// eslint-disable-next-line no-unused-vars
const entryOne = new User({
  email: 'shelby.harner@gmail.com',
  entry: [
    {
      date: '05/15/2021',
      emotion: 'Happy',
      notes: 'Hello, I am happy today.'
    },
  ]
});
// entryOne.save();

app.get('/', (req, res) => {
  //test server
  res.status(200).send('hello from root');
});

app.get('/user', (req, res) => {
  User.find((error, databaseResults) => {
    res.send(databaseResults);
  });
});

app.get('/entry', (req, res) => {

  User.find({ email: req.query.email }, (err, databaseResults) => {
    res.status(200).send(databaseResults);
  });
});

app.post('/entry', (req, res) => {

  User.find({ email: req.body.email }, (err, userData) => {

    if (userData.length < 1) {
      let newUser = new User({
        email: req.body.email,
        entry: [{
          date: req.body.entry[0].date,
          emotion: req.body.entry[0], // emotion still not being saved correctly the first time
          notes: req.body.entry[0].notes
        }]
      });
      newUser.save().then(newUserData => {
        console.log('newUserData',newUserData);
        res.status(200).send(newUserData.entry);
      });
    } else {
      let addEntry = userData[0];
      addEntry.entry.push(
        {
          date: req.body.entry[0].date,
          emotion: req.body.entry[0].emotion,
          notes: req.body.entry[0].notes
        }
      );
      addEntry.save().then(addEntryResults => {
        console.log('dataResults:',addEntryResults);
        res.status(200).send(addEntryResults.entry);});
    }
  });
});

app.delete('/entry/:id', (req,res)=>{
  const id = req.params.id;
  const email = req.query.user;

  User.find({email: email},(err,userData)=>{
    let user = userData[0];
    user.entry = user.entry.filter(test => {
      // leftover console logs
      console.log('test._id',test._id);
      console.log('id',id);
      return `${test._id}` !== id;
    });
    user.save().then((usersData) => {
      console.log(usersData);
      res.status(200).send(usersData.entry);
    });

  });
});

app.get('/zen', getZen);

app.listen(PORT, () => console.log(`server listening on port: ${PORT}`));
