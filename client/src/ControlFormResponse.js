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

        /*
         * TODO: Connect to Back-end
         */ 
        // fetch(`http://localhost:5000/api/forms`)
        //     .then(results => results.json())
        //     .then(json => {
        //         let forms = json.forms;
        //         this.setState({
        //             forms: forms,
        //             formsReady: true
        //         })
        //     })


        let { fid, rid } = this.props.match.params;

        this.setState({
            responseInfo: {
                form_id: fid,
                response_id: rid,
                fields:
                    [
                        {
                            name:"Birth_Date" , 
                            title: "Birth Date" , 
                            type: "Date",
                            required: true,
                            value : "2020-02-18T20:30:00.000Z"
                
                        }, 
                        {
                            name:"Number" , 
                            title: "Number" , 
                            type: "Number",
                            required: true,
                            value : "5"
                  
                        }, 
                        {
                            name: "Request_Type" , 
                            title: "Request Type" , 
                            type: "Text" , 
                            options:
                            [
                                {label : "Help" , value : "Help"}, 
                                {label : "Info" , value : "Information"} 
                            ] ,
                            value : "\"Help\""
                        }, 
                        {
                            name: "Home",
                            title: "خانه",
                            type: "Location",
                            label: "خیابان شریعتی",
                            value : {
                                "lat":35.618974646696394,
                                "long":51.36702734375001
                            },
                        },
                        {
                            name: "Work",
                            title: "محل کار",
                            type: "Location",
                            label: "خیابان اندرزگو",
                            value : {
                                "lat":55.618974646696394,
                                "long":61.36702734375001
                            },
                        },
                    ],
            },
            ready: true,
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