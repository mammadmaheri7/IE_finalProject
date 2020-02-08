import React, { Component } from 'react';
import {
    Container,
    LinearProgress,
    Button
} from '@material-ui/core';

import DynamicForm from './DynamicForm.js';
import * as Constants from './constants.js';

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
        fetch(Constants.HOST_URL + `/api/forms/${fid}/responses/${rid}`)
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
                    <br/>
                    
                    <Button style={{ float: "left" }} variant="contained" color="primary" href={`/control/form/${this.state.responseInfo.form_id}`}>
                        « برگشت
                    </Button>                    

                    <div style={{clear: "both"}}></div>

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