const mongoose = require('mongoose');
const Form = mongoose.model('forms');
const Respond = mongoose.model('responds')
const Polygon = mongoose.model('polygons')

const Counter = mongoose.model('counters');
const inside = require('point-in-polygon')

module.exports = (app) => {
  app.get('/api/forms/:fid/responses/customFilter',async(req,res) => {
    let result = {}
    let formId = req.params.fid
    let field = req.query.field
    let eq = req.query.eq
    let gt = req.query.gt
    let lt = req.query.lt
    let polygon_id = req.query.polygon_id

    let polygon = await Polygon.findOne({_id:polygon_id})

    let form = await Form.findOne({_id:formId})
    result.title = form.title
    result.form_id = form._id
    result.responses = []

    let basic_responses = await Respond.find({form_id:formId})
      let responses = []

      basic_responses.forEach(br => {

        if(field in br.response)
        {
          if(eq !== "null")
          {
            
            if(!(br.response[field] instanceof Object))
            {
              if((""+br.response[field]).includes(eq)){
                responses.push(br)
              }
            }
            else{
              if((""+br.response[field].value).includes(eq) || (""+br.response[field].label).includes(eq)){
                responses.push(br)
              }
            }
          }          
          else if(gt!== "null" || lt!== "null"){
            if(!(br.response[field] instanceof Object))
            {
              if(gt<= br.response[field] && lt>= br.response[field]){
                responses.push(br)
              }
            }
            else{
              if(gt<= br.response[field].value && lt>= br.response[field].value){
                responses.push(br)
              }
            }
          }
          /*
          if(inside([br.response[field].long, br.response[field].lat], polygon.geometry.coordinates[0]) ) {
            responses.push(br)
          }
          */
        }
        
      });
  
      const t_con = Object.assign({}, form._doc.fields);
      const con = Object.values(t_con).slice()

      responses.forEach(element => {
          let temp = {};
          temp.response_id = element._id;

          let reponse_fields_temp = JSON.parse(JSON.stringify(con));
          reponse_fields = Object.values(reponse_fields_temp).slice();

          reponse_fields.forEach(field => {
              field.value = element.response[field.name];
          });

          temp.fields = reponse_fields;

          result.responses.push(temp);
      });

    return res.send(result) 
    
  })

  //===========================


  
    app.get('/api/forms/:fid/responses/filter',async(req,res) => {
      let result = {}
      let formId = req.params.fid
      let field = req.query.field
      let polygon_id = req.query.polygon_id

      let polygon = await Polygon.findOne({_id:polygon_id})

      let form = await Form.findOne({_id:formId})
      result.title = form.title
      result.form_id = form._id
      result.responses = []

      let basic_responses = await Respond.find({form_id:formId})
        let responses = []

        basic_responses.forEach(br => {
          if(field in br.response)
          {
            if(inside([br.response[field].long, br.response[field].lat], polygon.geometry.coordinates[0]) ) {
              responses.push(br)
            }
          }
          
        });
    
        const t_con = Object.assign({}, form._doc.fields);
        const con = Object.values(t_con).slice()

        responses.forEach(element => {
            let temp = {};
            temp.response_id = element._id;

            let reponse_fields_temp = JSON.parse(JSON.stringify(con));
            reponse_fields = Object.values(reponse_fields_temp).slice();

            reponse_fields.forEach(field => {
                field.value = element.response[field.name];
            });

            temp.fields = reponse_fields;

            result.responses.push(temp);
        });

      return res.send(result) 
      
    }),
    app.get('/api/forms/:fid/responses/:rid', async (req, res) => {

        let formId = req.params.fid
        let reqId = req.params.rid

        let result = {}
        let form = await Form.findOne({ _id: formId })
        result.form_id = form._id

        let respond = await Respond.findOne({ _id: reqId })
        result.response_id = respond._id

        let temp = []
        temp = Object.values(form._doc.fields)
        temp.forEach(element => {
            element.value = respond.response[element.name]
        });
        result.fields = temp

        return res.send(result)
    })


    app.get('/api/forms/:fid/responses', async (req, res) => {
        let formId = req.params.fid

        let result = {}

        let form = await Form.findOne({ _id: formId })

        result.title = form.title
        result.form_id = form._id

        const t_con = Object.assign({}, form._doc.fields);
        const con = Object.values(t_con).slice()

        result.form_fields = con

        let responses = await Respond.find({ form_id: formId })
        //result.responses = responses
        result.responses = []

        responses.forEach(element => {
            let temp = {};
            temp.response_id = element._id;

            let reponse_fields_temp = JSON.parse(JSON.stringify(con));
            reponse_fields = Object.values(reponse_fields_temp).slice();

            reponse_fields.forEach(field => {
                field.value = element.response[field.name];
            });

            temp.fields = reponse_fields;

            result.responses.push(temp);
        });

        return res.send(result);
    })

    app.post('/api/forms/submit', async (req, res) => {
        let respond = {}
        respond.form_id = req.body.form_id

        value = await Counter.findOne({ _id: "respondid" }).catch(err => {
            console.log("error on finding id occured")
        });

        temp = value.sequence_value
        value.sequence_value = ++value.sequence_value;
        await value.save()

        respond._id = temp
        respond.response = Object.assign({}, req.body.response)

        let x = await Respond.create(respond).catch(err => {
            return res.status(400).send({
                "status": "error",
                "message": "Error message",
            })
        });

        return res.status(201).send({
            "status": "ok",
            "message": "submitted successfuly.",
        })
    })

    app.get('/api/forms/:uid', async (req, res) => {

        let request_id = req.params.uid
        let result = {}

        let form = await Form.findOne({ _id: request_id })

        result.title = form.title
        result.form_id = form._id
        result.fields = Object.values(form._doc.fields)

        return res.send(result)

    });

    app.get(`/api/forms`, async (req, res) => {
        let forms = await Form.find();
        let response = []
        forms.forEach(element => {
            let temp = {}

            temp.title = element.title
            temp.form_id = element._id
            temp.url = "api/forms/" + element._id
            response.push(temp)
        });

        let final = {}
        final.forms = response
        return res.status(200).send(final);
    });


    app.post(`/api/forms`, async (req, res) => {
        form = req.body

        value = await Counter.findOne({ _id: "formid" }).catch(err => {
            console.log("error on finding id occured")
        });

        temp = value.sequence_value
        value.sequence_value = ++value.sequence_value;
        await value.save()

        form._id = temp
        form.fields = Object.assign({}, req.body.fields)
        
        let x = await Form.create(form).catch(err => {
            return res.status(400).send({
                "status": "error",
                "message": "Error message",
            })
        });

        return res.status(201).send({
            "status": "ok",
            "message": form.title + " inserted successfuly.",
        })
    });

}