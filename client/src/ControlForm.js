import React, { Component } from 'react';
import {
    Container,
    LinearProgress,
    Button
} from '@material-ui/core';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class ControlForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formInfo: {
                form_id: null,
                title: 'عنوان فرم',
                fields: []
            },
            ready: false,
        }
    }

    componentDidMount() {

        // let { fid } = this.props.match.params;

        // fetch(`http://localhost:3001/api/forms/${fid}`)
        //     .then(results => results.json())
        //     .then(form => {
        //         let new_form_info = { ...this.state.formInfo };
        //         new_form_info.id = form.id;
        //         new_form_info.title = form.title;
        //         new_form_info.fields = form.fields;

        //         this.setState({
        //             formInfo: new_form_info,
        //             formReady: true
        //         })
        //     });


        this.setState({
            title: "First Form",
            form_id: 1,
            responses:
                [
                    {
                        response_id: 1,
                        fields:
                        [
                            {
                                name: "Request_Type" , 
                                title: "Request Type" , 
                                type: "Text" , 
                                value: "Submitted value by user",
                            },
                        ]                     
                    },
                ] 
            ,
            ready: true,
        });


    }


    handleSubmit(json) {
        let submit_body = {
            form_id: this.form_id,
            response: json
        }

        fetch('http://localhost:5000/api/form/submit', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: submit_body
        })
        .then((results) => results.json(), () => alert("ERROR!"))
        .then((json) => {
            alert(json.message); // shows message
            window.location.href = "../"; // redirects to ./
        });
    }

    createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }


    render() {
        if (!this.state.ready) // Loading Progress Bar
        {
            return (
                <LinearProgress />
            );
        }
        else
        {
            // const classes = useStyles();
            const rows = [
                this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
                this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
                this.createData('Eclair', 262, 16.0, 24, 6.0),
                this.createData('Cupcake', 305, 3.7, 67, 4.3),
                this.createData('Gingerbread', 356, 16.0, 49, 3.9),
              ];

            return (
                <Container>
                    <h2 className="form-title">{this.state.formInfo.title}</h2>
                    
                    <Button variant="contained" color="primary" href="/field">
                        « برگشت
                    </Button>

                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Dessert (100g serving)</TableCell>
                                    <TableCell align="right">Calories</TableCell>
                                    <TableCell align="right">Fat&nbsp;(g)</TableCell>
                                    <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                                    <TableCell align="right">Protein&nbsp;(g)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map(row => (
                                    <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.calories}</TableCell>
                                    <TableCell align="right">{row.fat}</TableCell>
                                    <TableCell align="right">{row.carbs}</TableCell>
                                    <TableCell align="right">{row.protein}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Container>
            );
        }
    }
}

export default ControlForm;