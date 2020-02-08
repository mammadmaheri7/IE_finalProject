import React, { Component } from 'react';
import * as Constants from './constants.js';

// Material UI
import {
    Container,
    LinearProgress,
    Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    createMuiTheme, MuiThemeProvider,
    FormControl,
    InputLabel,
    Select, MenuItem,
    TextField
} from '@material-ui/core';

// CSV
import { CSVLink } from "react-csv";

const themeTable = createMuiTheme({
    direction: 'rtl',
    typography: {
        fontFamily: 'IRANYekan'
    },
    overrides: {
        MuiTableRow: {
            root: {
                "cursor": 'pointer',
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
            form_fields: null,
            responses: null,
            polygons: null,
            filter: {
                options: [],
                name: null, // Field name
                type: null, // Field type
                value: null, // Polygon
                gt: null,
                lt: null,
            },
            ready: false,
        }
    }

    componentDidMount() {

        let { fid } = this.props.match.params;

        // fetch responses
        fetch(Constants.HOST_URL + `/api/forms/${fid}/responses`)
            .then(
                results => results.json(),
                error => alert("ERR: " + error)
            )
            .then(json => {
                this.setState({
                    title: json.title,
                    form_id: json.form_id,
                    form_fields: json.form_fields,
                    responses: json.responses,
                    ready: true,
                })
            });

        // fetch polygons
        fetch(Constants.HOST_URL + `/api/polygons`)
            .then(
                results => results.json(),
                error => alert("ERR: " + error)
            )
            .then(json => {
                console.log(json.polygons);
                this.setState({
                    polygons: json.polygons
                })
            });

    }

    handleRowClick = response_id => {
        window.location.href = `/control/form/${this.state.form_id}/response/${response_id}`; // redirects
    }

    handleFilterBySelect = event => {
        let field = this.state.form_fields.find(field => field.name === event.target.value);

        this.setState({
            filter: {
                ...this.state.filter,
                name: field.name,
                type: field.type,
                value: null,
            }
        })
    }

    handleLocationSelect = event => {
        this.setState({
            filter: {
                ...this.state.filter,
                value: event.target.value
            }
        });
    }

    handleTextFilter = event => {
        this.setState({
            filter: {
                ...this.state.filter,
                value: event.target.value
            }
        });
    }

    handleNumberEQFilter = event => {
        this.setState({
            filter: {
                ...this.state.filter,
                value: event.target.value
            }
        });
    }

    handleNumberGTFilter = event => {
        this.setState({
            filter: {
                ...this.state.filter,
                gt: event.target.value
            }
        });
    }

    handleNumberLTFilter = event => {
        this.setState({
            filter: {
                ...this.state.filter,
                lt: event.target.value
            }
        });
    }

    handlePolygonFilter = event => {
        this.setState({
            filter: {
                ...this.state.filter,
                value: event.target.value
            }
        })
    }


    applyFilter = event => {
        this.setState({
            ready: false
        })

        // API Call to apply filter with query according to filter type
        let query = Constants.HOST_URL;
        switch (this.state.filter.type) {
            case "Location":
                query += `/api/forms/${this.state.form_id}/responses/filter/?field=${this.state.filter.name}&polygon_id=${this.state.filter.value}`;
                break;

            case "Text":
                query += `/api/forms/${this.state.form_id}/responses/customFilter/?field=${this.state.filter.name}&eq=${this.state.filter.value}`;
                break;

            case "Number":
                query += `/api/forms/${this.state.form_id}/responses/customFilter/?field=${this.state.filter.name}&lt=${this.state.filter.lt}&gt=${this.state.filter.gt}&eq=${this.state.filter.value}`;
                break

            case "Date":
                query += `/api/forms/${this.state.form_id}/responses/customFilter/?field=${this.state.filter.name}&lt=${this.state.filter.lt}&gt=${this.state.filter.gt}&eq=${this.state.filter.value}`;
                break


            default:
                break;
        }

        fetch(query)
            .then(
                results => results.json(),
                error => alert("ERR: " + error)
            )
            .then(json => {
                this.setState({
                    title: json.title,
                    form_id: json.form_id,
                    responses: json.responses,
                    ready: true,
                })
            });

    }


    countTableFields = fields => {
        let x = 0;
        fields.forEach(field => {
            if (field.type === "Location" || field.type === "Number")
                x++;
        });
        return x;
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
            const form_fields = this.state.form_fields.slice();

            // Determine Headers of table & Filter-by Options
            let headers = [];
            let filterby = [];
            form_fields.forEach(field => {
                if (field.type === "Location" || field.type === "Number")
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

                let row_cells = [];
                response.fields.forEach(field => {
                    if (field.type === "Location" || field.type === "Number")
                        row_cells.push(field)
                })


                rows.push({
                    response_id: response.response_id,
                    values: row_cells,
                })

            });


            // Build Rows in MaterialUI Components
            let tableRows = [];
            let sumVals = new Array(this.countTableFields(form_fields)).fill(0);

            rows.forEach(row => {
                let rowCells = [];

                // headers
                rowCells.push(
                    <TableCell component="th" scope="row">
                        {row.response_id}
                    </TableCell>
                );

                // data rows
                row.values.forEach((val, index) => {
                    let rowCell = null;

                    console.log(val);

                    if (val.type === "Location") {
                        if (val.value.label !== undefined) {
                            rowCell =
                                <TableCell align="left" key={row.response_id + "_" + val.name}>
                                    {val.value.label}
                                </TableCell>
                        }
                        else {
                            rowCell =
                                <TableCell align="left" key={row.response_id + "_" + val.name}>
                                    {"(" + val.value.lat + ", " + val.value.long + ")"}
                                </TableCell>
                        }
                    }
                    else {
                        rowCell =
                            <TableCell align="left" key={row.response_id + "_" + val.name}>
                                {val.value}
                            </TableCell>

                        if (val.type === "Number") {
                            sumVals[index] += parseInt(val.value);
                        }
                    }
                    rowCells.push(rowCell);
                })


                // Add rows to table
                tableRows.push(
                    <TableRow key={row.response_id} hover onClick={() => this.handleRowClick(row.response_id)}>
                        {rowCells}
                    </TableRow>
                );

            });


            // Convert summations to MaterialUi Components
            let sumCells = sumVals.map(sum => (
                <TableCell align="left" style={{ color: "white" }}>
                    {sum === 0 ? '-' : sum}
                </TableCell>
            ));
            sumCells.unshift(
                <TableCell align="left" style={{ color: "white" }}>
                    <b>
                        مجموع:
                    </b>
                </TableCell>
            );

            // Add sum row to table
            tableRows.push(
                <TableRow hover={false} style={{ cursor: "default", backgroundColor: "#222f3e" }}>
                    {sumCells}
                </TableRow>
            );



            let filter_details = null;
            if (this.state.filter.type === "Location") {
                filter_details =
                    <div>
                        <FormControl>
                            <InputLabel ref="" id="demo-simple-select-outlined-label">
                                در منطقه:
                            </InputLabel>
                            <Select name="area" autoWidth={true} onChange={(e) => this.handlePolygonFilter(e)}>
                                {this.state.polygons.map(poly => (
                                    <MenuItem selected={this.state.filter.area === poly.polygon_id} value={poly.polygon_id}>{poly.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <br /><br />
                    </div>
            }
            else if (this.state.filter.type === "Text") {
                filter_details =
                    <div>
                        <FormControl>
                            <TextField id="standard-basic" label="دارای" name="text" onChange={(e) => this.handleTextFilter(e)} />
                        </FormControl>
                        <br /><br />
                    </div>
            }
            else if (this.state.filter.type === "Number") {
                filter_details =
                    <div>
                        <FormControl>
                            <TextField id="standard-basic" label="بزرگ تر از" name="text" onChange={(e) => this.handleNumberGTFilter(e)} />
                        </FormControl>
                        <br />
                        <FormControl>
                            <TextField id="standard-basic" label="کوچک تر از" name="text" onChange={(e) => this.handleNumberLTFilter(e)} />
                        </FormControl>
                        <br />
                        <FormControl>
                            <TextField id="standard-basic" label="مساوی" name="text" onChange={(e) => this.handleNumberEQFilter(e)} />
                        </FormControl>
                        <br /><br />
                    </div>
            }
            else if (this.state.filter.type === "Date") {
                filter_details =
                    <div>
                        {/* <FormControl>
                            <TextField id="standard-basic" label="بزرگ تر از" name="text" onChange={(e) => this.handleNumberGTFilter(e)} />
                        </FormControl>
                        <br />
                        <FormControl>
                            <TextField id="standard-basic" label="کوچک تر از" name="text" onChange={(e) => this.handleNumberLTFilter(e)} />
                        </FormControl>
                        <br /> */}
                        <FormControl>
                            <TextField id="standard-basic" label="دارای" name="text" onChange={(e) => this.handleNumberEQFilter(e)} />
                        </FormControl>
                        <br /><br />
                    </div>
            }



            // CSV Download now
            let csv_dl = null;
            let csv_data = [];

            // Prepare CSV
            csv_data.push(headers);
            rows.forEach(row => {
                let csv_row = [];
                row.values.forEach(v => {
                    if (v.type === "Location") {
                        if (v.label === undefined) {
                            csv_row.push("(" + v.value.lat + ", " + v.value.long + ")")
                        }
                        else {
                            csv_row.push(v.label);
                        }
                    }
                    else {
                        csv_row.push(v.value);
                    }

                })
                csv_data.push(csv_row);
            });

            return (
                <Container>

                    <Container>
                        <Button variant="contained" color="primary" href="/control" style={{ float: "left" }}>
                            « برگشت
                        </Button>

                        <h2>{this.state.title}</h2>

                        <CSVLink className="csv-dl" data={csv_data} filename="table.csv">دانلود CSV</CSVLink>

                        {csv_dl}

                        <br /><br />

                        {/* Data Table */}
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow style={{ backgroundColor: "#222f3e" }}>
                                        <TableCell component="th" scope="row" key="id" style={{ color: "white" }}>
                                            شماره پاسخ
                                            </TableCell>
                                        {headers.map(col => (
                                            <TableCell component="th" scope="row" key={col} style={{ color: "white" }}>
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
                                <br />

                                {filter_details}

                                <FormControl>
                                    <Button variant="contained" color="primary" onClick={(e) => this.applyFilter(e)}>
                                        فیلتر کن
                                    </Button>
                                </FormControl>

                            </MuiThemeProvider>
                        </form>
                    </Container>


                </Container>
            );
        }
    }
}

export default ControlForm;