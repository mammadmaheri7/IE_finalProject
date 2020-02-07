import React, { Component } from 'react';
import {
    Container,
    LinearProgress,
    Button
} from '@material-ui/core';

import DynamicForm from './DynamicForm.js';

class Control extends Component {
    constructor(props) {
        super(props);

        this.state = {
            responseInfo: null,
            ready: false
        }
    }

    componentDidMount() {

        let { fid, rid } = this.props.match.params;
        fetch(`http://localhost:5000/api/forms/${fid}/responses/${rid}`)
            .then(
                results => results.json(),
                error => alert("ERR: " + error)
            )
            .then(json => {
                console.log(json);
                this.setState({
                    responseInfo: json,
                    ready: true,
                })
            });
            
    }


    onSubmit = model => {
        alert(JSON.stringify(model));    
    };

    render() {
        if(!this.state.ready) // Loading Progress Bar
        {
            return (
                <LinearProgress />
            );
        }
        else // Forms loaded
        {


            return (
                <Container>
                    <h2 className="form-title">{this.state.responseInfo.title}</h2>
                    
                    <Button variant="contained" color="primary" href={`/control/form/${this.state.responseInfo.form_id}`}>
                        « برگشت
                    </Button>

                    <DynamicForm
                        valueAvailable={true}
                        className="form"
                        title="Registration"
                        model={JSON.stringify(this.state.responseInfo)}
                        onSubmit={model => {
                            this.handleSubmit(model);
                        }}
                    />

                </Container>
            );
        }
    }
}

export default Control;