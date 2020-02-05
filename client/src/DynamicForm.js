import React from "react";
import "./DynamicForm.css";
import {MapContainer} from './MapContainer'; 
import DatePicker from "react-datepicker";
import Button from '@material-ui/core/Button';
import "react-datepicker/dist/react-datepicker.css";
import TextField from '@material-ui/core/TextField';

export default class DynamicForm extends React.Component {
  state = {};

  constructor(props) {
    super(props);
    this.model = JSON.parse(this.props.model)
    this.state.id = this.model.id;


  }

  static getDerivedStateFromProps(nextProps, prevState) {
   // console.log("gds:p:s", nextProps.defaultValues, prevState);


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

    console.log("no state change");
    return null;
  }

  onSubmit = e => {
      console.log("submit :    ", this.state)
    e.preventDefault();
    if (this.props.onSubmit) this.props.onSubmit(this.state);
  };

  onChange = (e, key, type = "single") => {
    //console.log(`${key} changed ${e.target.value} type ${type}`);
    console.log(e)
    if (type === "single") {
      this.setState(
        {
          [key]: e.target.value
        },
        () => {}
      );
    } 
    else if (type === "MapLocation"){
     //   console.log("hi i MAPLOCAION!!!!!!!!")
        this.setState(
            {
              [key]: {
                  lat : e.latLng.lat(),
                  lng : e.latLng.lng()
              }
            },
            () => {}
          );
    }
    else if(type === "Date"){
      this.setState(
        {
          [key]: e
        },
        () => {}
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
        //console.log("found", key, this.state[key]);
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

  getFields = (model) =>{
    const fields = model.fields
   // console.log("model" , model)
    for (const field of fields){
        if(field.required !== undefined){
            field.props = {}
            field.props.required = field.required
        }
        if(field.type === "Text"){
            field.type = "text"
        }
    }
   // console.log("fields : ",fields)

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
      value = this.state[target] || "";

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
      if(m.options !== undefined){
        
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
    
            //console.log("Select default: ", value);
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
      else{
      if( type === "text"){
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
      if (type === "Location"){
          if(m.options === undefined){
            console.log("this is key key key",key)
            input =
            <MapContainer    
            {...props}               
            onClick={e => {
                this.onChange(e, key,"MapLocation");
              }}
            lat= {this.state[key] !== undefined ? this.state[key].lat : 1}
            lng = {this.state[key] !== undefined ? this.state[key].lng : 1}
            />
              input = <div >{input}</div>;
          }
          else{
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
      
              //console.log("Select default: ", value);
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

      if (type === "select" ) {
        input = m.options.map(o => {
          //console.log("select: ", o.value, value);
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

        //console.log("Select default: ", value);
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
      if (type === "Number"){
        input = (
          <input
            {...props}
            pattern = "[0-9]*"
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
      if (type === "Date"){
        input = (
          <DatePicker
          {...props}
          selected={this.state[key]} 
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
          //console.log("Checkbox: ", checked);
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
      //console.log("this is key", key)
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
    let title = this.model.title;

    return (
      <div className={this.props.className}>
        <h3 className="form-title">{title}</h3>
        <form
          className="dynamic-form"
          onSubmit={e => {
            this.onSubmit(e);
          }}
        >
          {this.renderForm()}
          <div className="form-actions">
            <Button type="submit" color="primary" variant="contained" >submit</Button>
          </div>
        </form>
      </div>
    );
  }
}
