import React from "react";
import "./DynamicForm.css";
import { MapContainer } from './MapContainer';
import DatePicker from "react-datepicker";
import Button from '@material-ui/core/Button';
import "react-datepicker/dist/react-datepicker.css";
import TextField from '@material-ui/core/TextField';

export default class DynamicForm extends React.Component {
    state = {};

    constructor(props) {
        super(props);
        this.valueAvailable = this.props.valueAvailable;
        this.model = JSON.parse(this.props.model)
        this.state.id = this.model.form_id;


    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            nextProps.defaultValues &&
            nextProps.defaultValues.id !== prevState.id
        ) {
            //   Object.keys(prevState).forEach(k => {
            //     derivedState[k] = "";
            //   });
            return {
                ...nextProps.defaultValues
            };
        }

        return null;
    }

    onSubmit = e => {
        e.preventDefault();
        if (this.props.onSubmit) this.props.onSubmit(this.state);
    };

    onChange = (e, key, type = "single", isOption = false) => {
        let text = undefined;
        if (isOption) {
            let selectedIndex = e.nativeEvent.target.selectedIndex;
            text = e.nativeEvent.target[selectedIndex].text;
        }
        if (type === "single") {
            if (isOption) {
                this.setState(
                    {
                        [key]: { label: text, value: e.target.value }
                    },
                    () => { }
                );
            } else {
                this.setState(
                    {
                        [key]: e.target.value
                    },
                    () => { }
                );
            }
        }
        else if (type === "Number") {
            if (isOption) {
                this.setState(
                    {
                        [key]: { label: text, value: parseInt(e.target.value) }
                    },
                    () => { }
                );
            } else {
                this.setState(
                    {
                        [key]: parseInt(e.target.value)
                    },
                    () => { }
                );
            }
        }
        else if (type === "LocationOption") {
            let optionalLocationValue = JSON.parse(e.target.value);
            optionalLocationValue.label = text;
            this.setState(
                {
                    [key]: optionalLocationValue
                },
                () => { }
            );
        }
        else if (type === "MapLocation") {
            this.setState(
                {
                    [key]: {
                        lat: e.latLng.lat(),
                        long: e.latLng.lng()
                    }
                },
                () => { }
            );
        }
        else if (type === "Date") {
            this.setState(
                {
                    [key]: e
                },
                () => { }
            );
        }
        else {
            // Array of values (e.g. checkbox): TODO: Optimization needed.
            let found = this.state[key]
                ? this.state[key].find(d => d === e.target.value)
                : false;

            if (found) {
                let data = this.state[key].filter(d => {
                    return d !== found;
                });
                this.setState({
                    [key]: data
                });
            } else {
                // this.setState({
                //   [key]: [e.target.value, ...this.state[key]]
                // });
                let others = this.state[key] ? [...this.state[key]] : [];
                this.setState({
                    [key]: [e.target.value, ...others]
                });
            }
        }
    };

    getFields = (model) => {
        const fields = model.fields
        for (const field of fields) {
            field.props = {}
            if (this.valueAvailable === true) {
                field.props.disabled = true;
            }
            if (field.required !== undefined) {
                field.props.required = field.required
            }
            if (field.type === "Text") {
                field.type = "text"
            }
        }

        return fields
    }

    renderForm = () => {
        let model = this.model;
        let fields = this.getFields(model)

        let formUI = fields.map(m => {
            let key = m.name;
            let type = m.type || "text";
            let props = m.props || {};
            let name = m.name;
            let value = m.value;
            let title = m.title;

            let target = key;
            if (this.valueAvailable) {
                if (type === "Date") {
                    value = new Date(JSON.parse(JSON.stringify(m.value)));
                }
                else
                    value = m.value;
            }
            else
                value = this.state[target] || "";
            if (type === "Location" && (m.options !== undefined)) {
                value = JSON.stringify(m.value)
            }

            let input = (
                <input
                    {...props}
                    className="form-input"
                    type={type}
                    key={key}
                    name={name}
                    value={value}
                    onChange={e => {
                        this.onChange(e, target);
                    }}
                />
            );
            if (m.options !== undefined) {
                input = m.options.map(o => {
                    let optionValue = o.value;
                    if (typeof (optionValue) !== "string") {
                        optionValue = JSON.stringify(optionValue);
                    }
                    //optionValue.label = undefined;
                    return (
                        <option
                            {...props}
                            className="form-input"
                            key={o.label}
                            value={optionValue}
                        >
                            {(o.label)}
                        </option>
                    );
                });
                let typeToSend = "single";
                if (type === "Location") {
                    typeToSend = "LocationOption";
                }
                if (type === "Number") {
                    typeToSend = "Number";
                }
                let jsonValue = undefined;
                try {
                    jsonValue = JSON.parse(value);
                } catch{

                }
                if (jsonValue !== undefined) {
                    jsonValue.label = undefined;
                    value = JSON.stringify(jsonValue);
                }
                input = (
                    <select
                        {...props}
                        value={value instanceof Object ? value.value : value}
                        onChange={e => {
                            this.onChange(e, key, typeToSend, true);
                        }}
                    >
                        <option value="">انتخاب کنید</option>
                        {input}
                    </select>
                );


            }
            else {
                if (type === "text") {
                    input = (
                        <TextField id="standard-basic" placeholder={title}
                            {...props}
                            className="form-input"
                            type={type}
                            key={key}
                            name={name}
                            value={value}
                            onChange={e => {
                                this.onChange(e, target);
                            }}
                        />
                    );
                }
                if (type === "Location") {

                    if (m.options === undefined) {
                        input =
                            <MapContainer
                                {...props}
                                onClick={e => {
                                    this.onChange(e, key, "MapLocation");
                                }}
                                lat={value !== undefined ? value.lat : 1}
                                lng={value !== undefined ? value.long : 1}
                            />
                        input = <div >{input}</div>;
                    }
                    else {
                        input = m.options.map(o => {
                            return (
                                <option
                                    {...props}
                                    className="form-input"
                                    key={o.label}
                                    value={JSON.stringify(o.value)}
                                >

                                    {JSON.stringify(o.value)}
                                </option>
                            );
                        });

                        input = (
                            <select
                                {...props}
                                value={value}
                                onChange={e => {
                                    this.onChange(e, key);
                                }}
                            >
                                <option value="">Choose</option>
                                {input}
                            </select>
                        );

                    }
                }
                if (type === "radio") {
                    input = m.options.map(o => {
                        let checked = o.value === value;
                        return (
                            <React.Fragment key={"fr" + o.key}>
                                <input
                                    {...props}
                                    className="form-input"
                                    type={type}
                                    key={o.key}
                                    name={o.name}
                                    checked={checked}
                                    value={o.value}
                                    onChange={e => {
                                        this.onChange(e, o.name);
                                    }}
                                />
                                <label key={"ll" + o.key}>{o.label}</label>
                            </React.Fragment>
                        );
                    });
                    input = <div className="form-group-radio">{input}</div>;
                }

                if (type === "select") {
                    input = m.options.map(o => {
                        return (
                            <option
                                {...props}
                                className="form-input"
                                key={o.key}
                                value={o.value}
                            >
                                {o.value}
                            </option>
                        );
                    });

                    input = (
                        <select
                            {...props}
                            value={value}
                            onChange={e => {
                                this.onChange(e, key);
                            }}
                        >
                            <option value="">Choose</option>
                            {input}
                        </select>
                    );
                }
                if (type === "Number") {
                    input = (
                        <input
                            {...props}
                            pattern="[0-9]*"
                            className="form-input"
                            type={type}
                            key={key}
                            name={name}
                            value={value}
                            onChange={e => {
                                this.onChange(e, target, "Number");
                            }}
                        />
                    );

                }
                if (type === "Date") {
                    input = (
                        <DatePicker
                            {...props}
                            selected={value}
                            onChange={e => {
                                this.onChange(e, key, "Date");
                            }}
                        />)
                }
                if (type === "checkbox") {
                    input = m.options.map(o => {
                        //let checked = o.value == value;
                        let checked = false;
                        if (value && value.length > 0) {
                            checked = value.indexOf(o.value) > -1 ? true : false;
                        }
                        return (
                            <React.Fragment key={"cfr" + o.key}>
                                <input
                                    {...props}
                                    className="form-input"
                                    type={type}
                                    key={o.key}
                                    name={o.name}
                                    checked={checked}
                                    value={o.value}
                                    onChange={e => {
                                        this.onChange(e, key, "multiple");
                                    }}
                                />
                                <label key={"ll" + o.key}>{o.label}</label>
                            </React.Fragment>
                        );
                    });

                    input = <div className="form-group-checkbox">{input}</div>;
                }
            }
            return (
                <div key={"g" + key} className="form-group">
                    <label className="form-label" key={"l" + key} htmlFor={key}>
                        {m.title}
                    </label>
                    {input}
                </div>
            );
        });
        return formUI;
    };

    render() {
        let submitButtonDisabled = this.valueAvailable;
        return (
            <div className={this.props.className}>
                <form
                    className="dynamic-form"
                    onSubmit={e => {
                        this.onSubmit(e);
                    }}
                >
                    {this.renderForm()}
                    <div className="form-actions">
                        <Button disabled={submitButtonDisabled} type="submit" color="primary" variant="contained" >ارسال</Button>
                    </div>
                </form>
            </div>
        );
    }
}
