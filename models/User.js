'use strict'

const mongoose = require('mongoose');
const {Schema} = mongoose;

const entrySchema = new Schema({
  date: String,
  emotion: String,
  notes: String
});

const userSchema = new Schema({
  email: String,
  entry: [entrySchema]
});

const User = mongoose.model('User', userSchema)

module.exports = User;
