import React, { Component } from 'react';
import {
    Container, Button,
} from '@material-ui/core';


class Login extends Component {
    render() {
        
        return (
            
            <Container>
                <h2>ورود به سیستم:</h2>

                <br />
                <Button variant="contained" color="primary" href="/field">
                    ثبت اطلاعات
                </Button>
                <br /><br />
                <Button variant="contained" color="default" href="/control">
                    مرکز کنترل
                </Button>
            </Container>

        );
        
    }
}

export default Login;