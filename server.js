'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const getZen = require('./handlers/zen');
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const User = require('./models/User');
const { res } = require('express');

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

entryOne.save();

app.get('/user', (req, res) => {
  User.find((error, databaseResults) => {
    res.send(databaseResults);
  })
});

app.get('/entry', (req, res) => {
  console.log(req)
  User.find({ email: 'shelby.harner@gmail.com' }, (err, databaseResults) => {
    res.send(databaseResults)
  })
});

app.post('/entry', (req, res) => {
  console.log('this is the request', req)
  // User.find({ email: req.body.email }, (err, databaseResults) => {
  //   if (databaseResults.length < 1) {
  //     res.status(400).send('user does not exist');
  //   } else {
      let user = new User({
        email: 'shelby.harner@gmail.com',
        entry: [{
          date: "05/15/2021",
          emotion: "Happy",
          notes: "Happy, happy, joy, joy"
        }]
      });
      console.log(user)
      user.save().then(dataResult => {
        res.send(dataResult)
    //   })
    // }
  });
});

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  //test server
  res.status(200).send('hello from root');
});
app.get('/zen', getZen);

app.listen(PORT, () => console.log(`server listening on port: ${PORT}`));
