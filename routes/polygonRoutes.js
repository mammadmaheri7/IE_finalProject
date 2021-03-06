const mongoose = require('mongoose');
const Polygon = mongoose.model('polygons');
const Counter = mongoose.model('counters');
const inside = require('point-in-polygon')


module.exports = (app) => {

  app.post('/api/polygons', async (req, res) => {

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

    let x = await Polygon.create(polygon).catch(async err => {
        
        console.log(err)
        
    })  

    return res.status(200).send("dasf")
  }),

  app.get('/api/polygons/',  async(req,res) => {     
    let lat = req.query.lat
    let long = req.query.long
    result = {
        polygons : []
    }  
    let pols = await Polygon.find();
    pols.forEach(element => {  
            let temp = {}
            temp.name = element.properties.name
            temp.polygon_id = element._id
            result.polygons.push(temp)
    });
    return res.status(200).send(result) ;
  })


  



  

}