import React, { Component } from 'react';
import {
    Container,
    LinearProgress,
    List, ListItem, ListItemText,
    Button
} from '@material-ui/core';
import { Link } from 'react-router-dom';


class Control extends Component {
    constructor(props) {
        super(props);

        this.state = {
            forms: [],
            formsReady: false
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


        this.setState({
            forms:
            [
                {
                    "title":"فرم اول" , 
                    "form_id": "1" , 
                    "url": "/api/forms/1"                     
                },
                {
                    "title":"فرم دوم" , 
                    "form_id": "2" , 
                    "url": "/api/forms/2"                     
                },
            ],
            formsReady: true
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
                    <h1>لیست فرم‌ها:</h1>

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

export default Control;