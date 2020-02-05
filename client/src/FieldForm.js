import React, { Component } from 'react';
import {
    Container,
    LinearProgress,
    Button
} from '@material-ui/core';

import DynamicForm from './DynamicForm.js';



class FieldForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formInfo: {
                form_id: null,
                title: 'عنوان فرم',
                fields: []
            },
            formReady: false,
        }
    }

    componentDidMount() {

        let { fid } = this.props.match.params;

        // fetch(`http://localhost:3001/api/forms/${fid}`)
        //     .then(results => results.json())
        //     .then(form => {
        //         let new_form_info = { ...this.state.formInfo };
        //         new_form_info.id = form.id;
        //         new_form_info.title = form.title;
        //         new_form_info.fields = form.fields;

        //         this.setState({
        //             formInfo: new_form_info,
        //             formReady: true
        //         })
        //     });


        this.setState({
            formInfo: {
                title: "First Form" , 
                form_id: fid, 
                fields:
                [
                    {
                        name:"First_Name" , 
                        title: "First Name" , 
                        type: "Text",
                        required: true
                    }, 
                    {
                        name: "Loc" , 
                        title: "Your Location" , 
                        type: "Location",
                        required: false
                    }, 
                    {
                        name: "Request_Type" , 
                        title: "Request Type" , 
                        type: "Text" , 
                        options:
                        [
                            {label : "Help" , value : "Help"}, 
                            {label : "Info" , value : "Information"} 
                        ] 
                    } , 
                    {
                        name:"Base_Location" , 
                        title : "Base Location" , 
                        type : "Location" , 
                        options:
                        [
                            {label : "Base1" , value : {lat : "1.2" , long: "3.2"}}, 
                            {label : "Base2" , value : {lat : "2.3" , long : "1.434" }} 
                        ] 
                    } 
                ] 
            },
            formReady: true,
        });


    }


    handleSubmit(json) {
        let submit_body = {
            form_id: this.form_id,
            response: json
        }

        fetch('http://localhost:5000/api/form/submit', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: submit_body
        })
        .then((results) => results.json(), () => alert("ERROR!"))
        .then((json) => {
            alert(json.message); // shows message
            window.location.href = "../"; // redirects to ./
        });
    }


    render() {
        if (!this.state.formReady) // Loading Progress Bar
        {
            return (
                <LinearProgress />
            );
        }
        else // Forms loaded
        {
            return (
                <Container>
                    <h2 className="form-title">{this.state.formInfo.title}</h2>
                    
                    <Button variant="contained" color="primary" href="/field">
                        « برگشت
                    </Button>

                    <DynamicForm
                        className="form"
                        title="Registration"
                        model={JSON.stringify(this.state.formInfo)}
                        onSubmit={model => {
                            this.handleSubmit(model);
                        }}
                    />

                </Container>
            );
        }
    }
}

export default FieldForm;