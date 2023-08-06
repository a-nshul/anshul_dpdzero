const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
