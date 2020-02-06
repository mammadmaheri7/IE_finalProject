import React, { Component } from 'react';

// Material UI
import {
    Container,
    LinearProgress,
    Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    createMuiTheme, MuiThemeProvider,
    FormControl,
    InputLabel, Input, FormHelperText, OutlinedInput, FilledInput,
    Select, MenuItem
} from '@material-ui/core';

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
        },

    }
});

const themeForm = createMuiTheme({
    direction: 'rtl',
    typography: {
        fontFamily: 'IRANYekan'
    },
    overrides: {
        MuiSelect: {
            selectMenu: {
                minWidth: 200,
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
            filter: {
                name: null, // Field name
                type: null // Field type
            }
        }
    }

    componentDidMount() {

        // TODO:
        // fetch responses
        // fetch polygons

        // fetch(`http://localhost:5000/api/forms/${fid}`)
        //     .then(results => results.json())
        //     .then(form => {
        //         let new_form_info = { ...this.state.formInfo };
        //         new_form_info.id = form.id;
        //         new_form_info.title = form.title;
        //         new_form_info.fields = form.fields;

        //         this.setState({
        //             formInfo: new_form_info,
        //             ready: true
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
                                    name: "Birth_Date",
                                    title: "Birth Date",
                                    type: "Date",
                                    required: true,
                                    value: "2020-02-18T20:30:00.000Z"

                                },
                                {
                                    name: "Number",
                                    title: "Number",
                                    type: "Number",
                                    required: true,
                                    value: "5"

                                },
                                {
                                    name: "Request_Type",
                                    title: "Request Type",
                                    type: "Text",
                                    options:
                                        [
                                            { label: "Help", value: "Help" },
                                            { label: "Info", value: "Information" }
                                        ],
                                    value: "\"Help\""
                                },
                                {
                                    name: "Home",
                                    title: "خانه",
                                    type: "Location",
                                    label: "خیابان شریعتی",
                                    value: {
                                        "lat": 35.618974646696394,
                                        "long": 51.36702734375001
                                    },
                                },
                                {
                                    name: "Work",
                                    title: "محل کار",
                                    type: "Location",
                                    label: "خیابان اندرزگو",
                                    value: {
                                        "lat": 55.618974646696394,
                                        "long": 61.36702734375001
                                    },
                                },
                            ],
                    },
                    {
                        response_id: 2,
                        fields:
                            [
                                {
                                    name: "Birth_Date",
                                    title: "Birth Date",
                                    type: "Date",
                                    required: true,
                                    value: "2020-02-18T20:30:00.000Z"

                                },
                                {
                                    name: "Number",
                                    title: "Number",
                                    type: "Number",
                                    required: true,
                                    value: "5"

                                },
                                {
                                    name: "Request_Type",
                                    title: "Request Type",
                                    type: "Text",
                                    options:
                                        [
                                            { label: "Help", value: "Help" },
                                            { label: "Info", value: "Information" }
                                        ],
                                    value: "\"Help\""
                                },
                                {
                                    name: "Home",
                                    title: "خانه",
                                    type: "Location",
                                    label: "خیابان 1",
                                    value: {
                                        "lat": 35.618974646696394,
                                        "long": 51.36702734375001
                                    },
                                },
                                {
                                    name: "Work",
                                    title: "محل کار",
                                    type: "Location",
                                    label: "خیابان 2",
                                    value: {
                                        "lat": 55.618974646696394,
                                        "long": 61.36702734375001
                                    },
                                },
                            ],
                    },
                ]
            ,
            polygons:
                [
                    {
                        polygon_id: 1,
                        name: "تهران",
                    },
                    {
                        polygon_id: 2,
                        name: "مشهد",
                    },
                    {
                        polygon_id: 3,
                        name: "شیراز",
                    },
                ],
            ready: true,
        });

    }


    handleRowClick = response_id => {
        window.location.href = `/control/form/${this.state.form_id}/response/${response_id}`; // redirects
    }

    handleFilterBySelect = event => {
        const option = event.target;

        this.state

        this.setState({
            filter: {
                name: option.name,
                type: option.type
            }
        })
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

            // Determine Headers of table & Filter-by Options
            let headers = [];
            let filterby = [];
            sample_response.fields.forEach(field => {
                if (field.type === "Location")
                    headers.push(field.title);

                filterby.push({
                    title: field.title,
                    type: field.type,
                    name: field.name
                })
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


            let filter_details = null;
            if(this.state.filter.type === "Location")
            {
                filter_details =
                    <FormControl>
                        <InputLabel ref="" id="demo-simple-select-outlined-label">
                            در منطقه:
                        </InputLabel>
                        <Select
                            name="area"
                            autoWidth={true}
                        >
                            {filterby.map(item => (
                                <MenuItem value={item.name}>{item.title}</MenuItem>
                            ))}                 
                        </Select>
                    </FormControl>
            }


            return (
                <Container>

                    <Container>
                        <h2 className="form-title">{this.state.title}</h2>

                        <Button variant="contained" color="primary" href="/control">
                            « برگشت
                        </Button>

                        {/* Data Table */}
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

                    <Container>

                        <h2>فیلتر کردن:</h2>
                        {/* Filter */}
                        <form noValidate autoComplete="off">
                            <MuiThemeProvider theme={themeForm}>

                                {/* <FormControl variant="outlined">
                                <InputLabel htmlFor="component-outlined">فیلتر با؟</InputLabel>
                                <OutlinedInput id="component-outlined" label="Name" />
                            </FormControl> */}

                                <FormControl>
                                    <InputLabel ref="" id="demo-simple-select-outlined-label">
                                        بر اساس:
                                    </InputLabel>
                                    <Select
                                        name="filterby"
                                        autoWidth={true}
                                        onChange={(e) => this.handleFilterBySelect(e)}
                                    >
                                        {filterby.map(item => (
                                            <MenuItem selected={this.state.filter.name === item.name} value={item.name}>{item.title}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <br />

                                {filter_details}

                            </MuiThemeProvider>
                        </form>
                    </Container>


                </Container>
            );
        }
    }
}

export default ControlForm;