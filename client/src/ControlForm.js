import React, { Component } from 'react';

// Material UI
import {
    Container,
    LinearProgress,
    Button
} from '@material-ui/core';
import {
    createMuiTheme, MuiThemeProvider
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const themeTable = createMuiTheme({
    direction: 'rtl',
    typography: {
        fontFamily: 'IRANYekan'
    },
    overrides: {
        MuiTableRow: {
            root: {
                "cursor": 'pointer',
                "&:hover": {
                    backgroundColor: '#f1f1f1',
                },
            }
        }
    }
});

class ControlForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "Sample form",
            form_id: null,
            responses: null,
            ready: false,
        }
    }

    componentDidMount() {


        // fetch(`http://localhost:5000/api/forms/${fid}`)
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

        let { fid } = this.props.match.params;

        this.setState({
            title: "First Form",
            form_id: fid,
            responses:
                [
                    {
                        response_id: 1,
                        fields:
                            [
                                {
                                    name: "Home",
                                    title: "خانه",
                                    type: "Location",
                                    label: "خیابان شریعتی",
                                    value:
                                    {
                                        "lat": "1.2",
                                        "long": "3.2",
                                    },
                                },
                                {
                                    name: "Work",
                                    title: "محل کار",
                                    type: "Location",
                                    label: "خیابان اندرزگو",
                                    value:
                                    {
                                        "lat": "5.5",
                                        "long": "6.6",
                                    },
                                },
                            ],
                    },
                    {
                        response_id: 2,
                        fields:
                            [
                                {
                                    name: "Home",
                                    title: "خانه",
                                    type: "Location",
                                    label: "پارک وی",
                                    value:
                                    {
                                        "lat": "1.2",
                                        "long": "3.2",
                                    },
                                },
                                {
                                    name: "Work",
                                    title: "محل کار",
                                    type: "Location",
                                    label: "ولنجک",
                                    value:
                                    {
                                        "lat": "5.5",
                                        "long": "6.6",
                                    },
                                },
                            ],
                    },
                ]
            ,
            ready: true,
        });

    }


    handleRowClick = response_id => {
        window.location.href = `/control/form/${this.state.form_id}/response/${response_id}`; // redirects to ./
    }



    render() {
        if (!this.state.ready) // Loading Progress Bar
        {
            return (
                <LinearProgress />
            );
        }
        else {
            const responses = this.state.responses.slice();
            const sample_response = responses[0];

            // Determine Headers of table
            let headers = [];
            sample_response.fields.forEach(field => {
                if (field.type === "Location")
                    headers.push(field.title);
            })

            // Determine Rows of table
            let rows = [];
            responses.forEach(response => {

                let location_fields = [];
                response.fields.forEach(field => {
                    if (field.type === "Location")
                        location_fields.push(field)
                })

                rows.push({
                    response_id: response.response_id,
                    values: location_fields,
                })
            });


            const tableRows = rows.map((row) => {
                return (
                    <TableRow key={row.response_id} hover onClick={() => this.handleRowClick(row.response_id)}>
                        <TableCell component="th" scope="row">
                            {row.response_id}
                        </TableCell>

                        {row.values.map(v => (
                            <TableCell align="left" key={row.response_id + "_" + v.name}>{v.label}</TableCell>
                        ))}
                    </TableRow>
                );
            });


            return (
                <Container>
                    <h2 className="form-title">{this.state.title}</h2>

                    <Button variant="contained" color="primary" href="/control">
                        « برگشت
                    </Button>

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell component="th" scope="row" key="id">
                                            ردیف
                                            </TableCell>
                                        {headers.map(col => (
                                            <TableCell component="th" scope="row" key={col}>
                                                {col}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                <MuiThemeProvider theme={themeTable}>
                                    <TableBody>
                                        {tableRows}
                                    </TableBody>
                                </MuiThemeProvider>
                            </Table>
                        </TableContainer>

                </Container>
            );
        }
    }
}

export default ControlForm;