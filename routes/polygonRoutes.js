const mongoose = require('mongoose');
const Polygon = mongoose.model('polygons');
const Counter = mongoose.model('counters');


module.exports = (app) => {

    

  app.post(`/api/polygons`, async (req, res) => {

    value = await Counter.findOne({ _id: "polygonid" }).catch(err => {
        console.log("error on finding id occured")
    });
      
    temp = value.sequence_value
    value.sequence_value = ++value.sequence_value;
    await value.save()

    let polygon = {}
    polygon._id = temp
    polygon.properties = req.body.properties
    res.send( req.body.geometry)
    polygon.geometry = req.body.geometry

    let x = await Polygon.create(polygon).catch(err => {
        console.log(err)
        return res.status(401).send({
            "status": "error",
            "message": "Error message",
        })
    })

    
  })



  

}