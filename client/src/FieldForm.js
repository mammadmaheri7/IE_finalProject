import React, { Component } from 'react';
import {
    Container,
    LinearProgress,
    Button
} from '@material-ui/core';

import DynamicForm from './DynamicForm.js';
import * as Constants from './constants.js';

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
        fetch(Constants.HOST_URL + `/api/forms/${fid}`)
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
        
        fetch(Constants.HOST_URL + '/api/forms/submit', {
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
                    <Button variant="contained" color="primary" href="/field" style={{ float: "left" }}>
                        « برگشت
                    </Button>
                    
                    <h2>{this.state.formInfo.title}</h2>

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