'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const getZen = require('./handlers/zen');
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/',(req,res)=>{
  //test server
  res.status(200).send('hello from root');
});
app.get('/zen',getZen);

app.listen(PORT, ()=> console.log(`server listening on port: ${PORT}`));
