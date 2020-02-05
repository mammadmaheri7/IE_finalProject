import React, { Component } from 'react';
import {
    Container,
    LinearProgress,
    Button
} from '@material-ui/core';

import FormGen from './FormGenerator';



class FormView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formInfo: {
                id: null,
                title: 'عنوان فرم',
                fields: []
            },
            formReady: false,
        }
    }

    componentDidMount() {

        let { fid } = this.props.match.params;


        fetch(`http://localhost:3001/api/forms/${fid}`)
            .then(results => results.json())
            .then(form => {
                let new_form_info = { ...this.state.formInfo };
                new_form_info.id = form.id;
                new_form_info.title = form.title;
                new_form_info.fields = form.fields;

                this.setState({
                    formInfo: new_form_info,
                    formReady: true
                })
            })

    }


    handleSubmit(json) {
        fetch('http://localhost:3001/api/form/submit', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(json)
        })
        .then((results) => results.json(), () => alert("ERROR!"))
        .then((json) => {
            alert(json.message); // shows success message
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
                    <Button variant="contained" color="primary" href="/">
                        « صفحه اصلی
                    </Button>

                    <FormGen objectInput={this.state.formInfo} onSubmit={this.handleSubmit} />
                </Container>
            );
            // TODO: Use library to genenrate form
        }
    }
}

export default FormView;