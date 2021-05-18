'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const getZen = require('./handlers/zen');
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const User = require('./models/User');
// eslint-disable-next-line no-unused-vars
const { res } = require('express');
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

app.get('/user', (req, res) => {
  User.find((error, databaseResults) => {
    res.send(databaseResults);
  });
});

app.get('/entry', (req, res) => {

  User.find({ email: req.query.email }, (err, databaseResults) => {
    console.log(databaseResults);
    res.status(200).send(databaseResults);
  });
});

app.post('/entry', (req, res) => {
  console.log('this is the request', req.body);

  User.find({ email: req.body.email }, (err, userData) => {
    console.log('mongoos',userData[0]);

    if (userData.length < 1) {
      res.status(400).send('user does not exist');
    } else {
      let addEntry = userData[0];
      addEntry.entry.push(
        {
          date: req.body.entry[0].date,
          emotion: req.body.entry[0].emotion,
          notes: req.body.entry[0].notes
        }
      );
      addEntry.save().then(dataResult => {
        console.log('dataResults:',dataResult.entry);
        res.send(dataResult.entry);});

    }
  });
});

app.get('/', (req, res) => {
  //test server
  res.status(200).send('hello from root');
});

app.get('/zen', getZen);

app.listen(PORT, () => console.log(`server listening on port: ${PORT}`));

// if (databaseResults.length < 1) {
//   res.status(400).send('user does not exist');
// } else {
//   let user = new User({
//     email: req.body.email,
//     entry: [{
//       date: req.body,
//       emotion: 'fierce',
//       notes: 'fierce notes'
//     }]
//   });
