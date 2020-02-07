const mongoose = require('mongoose');
const Form = mongoose.model('forms');

const Counter = mongoose.model('counters');

module.exports = (app) => {

  app.get('/api/:uid',async (req,res)=>{
    
    let request_id = req.params.uid
    let result = {}

    let form = await Form.findOne({_id:request_id})
       
    result.title = form.title
    result.form_id = form._id
    result.fields = Object.values(form._doc.fields) 
     
     res.send(result)
     
  });
  
  app.get(`/api/forms`, async (req, res) => {
    let forms = await Form.find();
    let response = []
    forms.forEach(element => {
      let temp = {}
      
      temp.title = element.title
      temp.form_id = element._id
      temp.url = "api/forms/"+ element._id
      response.push(temp)
    });
    
    let final = {}
    final.forms = response
    return res.status(200).send(final);
  });
  

  app.post(`/api/forms`, async (req, res) => {
    form = req.body
    

    value = await Counter.findOne({_id:"formid"}).catch(err => {
      console.log("error on finding id occured")
    });
    
    temp = value.sequence_value
    value.sequence_value = ++value.sequence_value;
    await value.save()

    form._id = temp
    form.fields = Object.assign({}, req.body.fields)
    //console.log(form.fields)
    let x  = await Form.create(form).catch(err => {
      return res.status(400).send({
        "status": "error",
        "message": "Error message",
      })
    });

    return res.status(201).send({
      "status": "ok",
      "message": form.title+" inserted successfuly.",
    })
  });

  app.get(`/api/forms`, async (req, res) => {
    let forms = await Form.find();
    let response = []
    forms.forEach(element => {
      let temp = {}
      
      temp.title = element.title
      temp.form_id = element._id
      temp.url = "api/forms/"+ element._id
      response.push(temp)
    });
    
    let final = {}
    final.forms = response
    return res.status(200).send(final);
  });


  

  /*
  app.put(`/api/product/:id`, async (req, res) => { 
    const {id} = req.params;

    let product = await Product.findByIdAndUpdate(id, req.body);

    return res.status(202).send({
      error: false,
      product
    })

  });

  app.delete(`/api/product/:id`, async (req, res) => {
    const {id} = req.params;

    let product = await Product.findByIdAndDelete(id);

    return res.status(202).send({
      error: false,
      product
    })

  })
  */

}