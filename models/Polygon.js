const mongoose = require('mongoose');
const {Schema} = mongoose;

const polygonSchema = new Schema({
    _id : Number,
    properties : {
        polygon_id : Number,
        name : String
    },
    geometry : Object
},{strict: false})

mongoose.model('polygons', polygonSchema);