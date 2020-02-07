import React, { Component } from 'react';
import {
    Container,
    LinearProgress,
    List, ListItem, ListItemText,
    Button
} from '@material-ui/core';
import { Link } from 'react-router-dom';


class Field extends Component {
    constructor(props) {
        super(props);

        this.state = {
            forms: [],
            formsReady: false
        }
    }

    componentDidMount() {

        fetch(`http://localhost:5000/api/forms`)
            .then(results => results.json())
            .then(json => {
                let forms = json.forms;
                this.setState({
                    forms: forms,
                    formsReady: true
                })
            })
            
    }

    render() {
        if(!this.state.formsReady) // Loading Progress Bar
        {
            return (
                <LinearProgress />
            );
        }
        else // Forms loaded
        {
            const forms = this.state.forms;
            const listItems = forms.map((item) => {
                return (
                    <ListItem button key={item.form_id} component={Link} to={`/field/form/${item.form_id}`}>
                            <ListItemText primary={item.title} />
                    </ListItem>
                );
            });

            return (
              
                <Container>
                    <h1>ثبت فرم:</h1>

                    <List component="nav">
                        {listItems}
                    </List>

                    
                    <Button variant="contained" color="primary" href="/">
                        « برگشت
                    </Button>
                </Container>

            );
        }
    }
}

export default Field;