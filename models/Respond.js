const mongoose = require('mongoose');
const {Schema} = mongoose;

const respondSchema = new Schema({
    _id: Number,
    form_id: Number,
    response: Object,
},{strict: false}) 

mongoose.model('responds', respondSchema);