import React, { Component } from 'react';
import {
    Container,
    Button
} from '@material-ui/core';

import AdminForm from './AdminForm.js'

class Admin extends Component {
    onSubmit = model => {


        fetch('https://ie-final-proj.herokuapp.com/api/forms/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(model)
        })
        .then(
            (results) => results.json(),
            (error) => alert("ERR: " + error))
        .then(
            (json) => {
                if(json.status === "ok")
                {
                    alert(json.message);
                    window.location.href = "./admin"; // redirects to ./
                }
                else if(json.status === "error")
                {
                    alert(json.message);
                    // json.errors.forEach(error => {
                    //     alert(error.message);
                    // });   
                }
            },
            () => alert("Error on receiving respond from server.")
        );

    };
    
    render() {
        return (
            
            <Container>
                <h1>پنل ادمین:</h1>

                <AdminForm onSubmit={model => this.onSubmit(model)} />

                <Button variant="contained" color="primary" href="/">
                    « برگشت
                </Button>
            </Container>

        );
    }
}

export default Admin;