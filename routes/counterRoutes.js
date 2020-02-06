const {getNextSequenceValue} = require('../models/Counter')
const mongoose = require('mongoose');
const Counter = mongoose.model('counters');


module.exports = (app) => {
    
    app.get(`/api/counter`, async (req, res) => {
        value = await Counter.findOne({_id:"formid"})
        value.sequence_value = ++value.sequence_value;
        await value.save()
        return res.send({
            cnt : value,
            
        });
    });
    
   
};

