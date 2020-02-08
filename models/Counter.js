const mongoose = require('mongoose');
const {Schema} = mongoose;

const counterSchema = new Schema({
    _id: String,
    sequence_value: String,
    
}) 


mongoose.model('counters', counterSchema);

const Counter = mongoose.model('counters');

module.exports = {
    getNextSequenceValue : (input) => {
        let temp = Counter.find({sequence_value})
        return(temp)
        var sequenceDocument = Counter.findByIdAndUpdate(input,{sequence_value:sequence_value+1});
        return sequenceDocument.sequence_value;
    }
}
