const mongoose = require('mongoose');
const Form = mongoose.model('forms');
const Respond = mongoose.model('responds')

const Counter = mongoose.model('counters');

module.exports = (app) => {

    app.get('/api/forms/:fid/responses/:rid', async (req, res) => {

        let formId = req.params.fid
        let reqId = req.params.rid

        let result = {}
        let form = await Form.findOne({ _id: formId })
        result.form_id = form._id

        let respond = await Respond.findOne({ _id: reqId })
        //console.log(respond)
        result.response_id = respond._id

        let temp = []
        temp = Object.values(form._doc.fields)
        temp.forEach(element => {
            element.value = respond.response[element.name]
        });
        result.fields = temp

        res.send(result)
    })


    app.get('/api/forms/:fid/responses', async (req, res) => {
        let formId = req.params.fid

        let result = {}

        let form = await Form.findOne({ _id: formId })

        result.title = form.title
        result.form_id = form._id


        //console.log(result.form_fields)

        const t_con = Object.assign({}, form._doc.fields);
        const con = Object.values(t_con).slice()

        result.form_fields = con
        //console.log(result.form_fields)

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

        res.send(result);
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

        //console.log(form.fields)
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

        res.send(result)

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
        //console.log(form.fields)
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


    app.get('/api/forms/:fid/responses/filter',async (req,res) => {
      return res.send("injam")
    })

}