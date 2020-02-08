import React, { Component } from 'react';
import {
    Container,
    LinearProgress,
    List, ListItem, ListItemText,
    Button
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import * as Constants from './constants.js';


class Control extends Component {
    constructor(props) {
        super(props);

        this.state = {
            forms: [],
            formsReady: false
        }
    }

    componentDidMount() {

        fetch(Constants.HOST_URL + `/api/forms`)
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
                    <ListItem button key={item.form_id} component={Link} to={`/control/form/${item.form_id}`}>
                            <ListItemText primary={item.title} />
                    </ListItem>
                );
            });

            return (
              
                <Container>             
                    <Button style={{ float: "left" }} variant="contained" color="primary" href="/">
                        « برگشت
                    </Button>

                    <h2>دیدن جواب‌ها:</h2>

                    <List component="nav">
                        {listItems}
                    </List>
                </Container>

            );
        }
    }
}

export default Control;