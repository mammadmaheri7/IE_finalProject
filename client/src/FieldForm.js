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
        fetch(`http://localhost:5000/api/forms/${fid}`)
            .then(
                (results) => results.json(),
                (error) => alert("ERR: " + error)
            )
            .then(form => {

                this.setState({
                    formInfo: {
                        form_id: form.form_id,
                        title: form.title,
                        fields: form.fields,
                    },
                    formReady: true
                });

            },
            () => alert("Error on receiving respond from server.")
        );

    }


    handleSubmit(model) {
        let submit_body = {
            form_id: this.state.formInfo.form_id,
            response: model
        }
        
        console.log(submit_body);

        fetch('http://localhost:5000/api/forms/submit', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submit_body)
        })
        .then(
            (results) => results.json(),
            (error) => alert("ERR: " + error)
        )
        .then(
            (json) => {
                if(json.status === "ok")
                {
                    alert(json.message);
                    window.location.href = "../"; // redirect
                }
                else if(json.status === "error")
                {
                    json.errors.forEach(error => {
                        alert(error.message);
                    });   
                }
                else {
                    window.location.href = "../"; // redirect
                }
            },
            () => alert("Error on receiving respond from server.")
        );
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