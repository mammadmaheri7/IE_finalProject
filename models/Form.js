const mongoose = require('mongoose');
const {Schema} = mongoose;

const formSchema = new Schema({
    _id: Number,
    title: String,
    filds: Object,
},{strict: false}) 

mongoose.model('forms', formSchema);