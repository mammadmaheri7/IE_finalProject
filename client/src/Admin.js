import React, { Component } from 'react';
import {
    Container,
    Button
} from '@material-ui/core';

import AdminForm from './AdminForm.js'

class Admin extends Component {
    onSubmit = model => {
        alert(JSON.stringify(model));    
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