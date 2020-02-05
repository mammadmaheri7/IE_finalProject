import 'bootstrap/dist/css/bootstrap.css';
import React, { Component } from "react";
import Select from "react-select";
import Form from "react-jsonschema-form";

import {MapContainer} from './MapContainer'; 
let input = '{ "title":"A smaple form" , "id" : "1234" , "fields" : [ { "name":"First_Name" , "title" : "First Name" , "type" : "Text", "required":true } , { "name":"Loc" , "title" : "Your Location" , "type" : "Location", "required":false } , { "name":"Request_Type" , "title" : "Request Type" , "type" : "Text" , "options" : [ {"label" : "Help" , "value" : "Help"}, {"label" : "Info" , "value" : "Information"} ] } , { "name":"Base_Location" , "title" : "Base Location" , "type" : "Location" ,"required": "true", "options" : [ {"label" : "Base1" , "value" : {"lat" : "1.2" , "long": "3.2"}}, {"label" : "Base2" , "value" : {"lat" : "2.3" , "long" : "1.434" }} ] } ] }';
let object_input = JSON.parse(input);
let converted_schema = schemaMaker(object_input);
let schema = converted_schema;



const uiSchema = uiSchemaMaker(object_input)

function type_finder(raw_type,options){
  if(options !== undefined)
    return {type:"object"};
    switch(raw_type){
        case "Text":
            return {type :"string" };
    
        case "Number":
            return {type : "number"};

        
        case "Date":
            return {type : "string",
                    format : "date"};

        case "Location":
            return { type : "object"};

        default:
            return { type: raw_type};
        }

}
function uiSchemaMaker(raw_json){
  let uiSchema_out = {}
  for (const element of raw_json.fields){
        if(element.type ==="Location"){
          uiSchema_out[element.name]={}
          uiSchema_out[element.name]["ui:field"] = "location"
        }
        if(element.options !== undefined){
          uiSchema_out[element.name]={}
          uiSchema_out[element.name]["ui:field"] = "dropdown"
        }

  }
  return uiSchema_out;

}
function schemaMaker(raw_json){
    let output_schema = {};
    output_schema.required = [];
    output_schema.options = {};
    output_schema.properties = {}
    output_schema.title = raw_json.title;
    output_schema.id = raw_json.id;
    output_schema.type = "object";
    for (const element of raw_json.fields){
        if(element.options !== undefined){
          output_schema.options[element.name] = element.options;
        }
        if(element.required === true){
        output_schema.required.push(element.name);
        }
        output_schema.properties[element.name] = {};
        let type_vars = type_finder(element.type,element.options);
        for( let key in type_vars){
            output_schema.properties[element.name][key] = type_vars[key];
        }
        output_schema.properties[element.name].title = element.title;
    }
    return output_schema;
}

class DropDown extends Component{
  constructor(props){
    super(props);
    this.state = {...props.formData};
    this.state = {
      selectedOption :null
    }
    this.options = this.create_label_options();
  }
  ChangeHandler = (selectedOption) => {
    //console.log(selectedOption.target.value);
    this.setState({ selectedOption });
      this.setState({
        option_is: (selectedOption)
      }, () => this.props.onChange(this.state));
  }
  create_label_options = () =>{
    let ret = []
    let options = converted_schema.options[this.props.name];
    for (let option_key of options) {
      let this_option = {}
      this_option.label = option_key.label;
      this_option.value = option_key.value;
      ret.push(this_option);
    }
    return ret;
  }

  render(){
    const selectedOption  = this.state.selectedOption;
    // console.log(" labelllls" ,this.options);
   return(  
   // <h3>{this.props.name}</h3>
   <div> 
     <h3>{schema.properties[this.props.name].title}</h3>
        <Select 
        options={this.options}
        value={selectedOption}
   onChange={this.ChangeHandler}>
     {/*this.create_options()*/}
    </Select>

   </div>
   )
  }
  
}

class _Map extends React.Component {
    constructor(props) {
      super(props);
      this.state = {...props.formData};
      this.state = {
        
        lat : -20.397,
        lng : 150.644,
      };
    //  console.log("this is my props:  " , this.props)

    }
    _onClick = (obj) =>
    {
       // console.log(obj.latLng.lat())
        this.setState({
            lat: obj.latLng.lat(),
            lng: obj.latLng.lng(),
    },() => this.props.onChange(this.state)

    );
  }
    render() {


      return (
        <div>
        <h3>{schema.properties[this.props.name].title}</h3>

          <MapContainer onClick = {this._onClick} 
          lat= {this.state.lat}
          lng = {this.state.lng}
          />
        </div>
      );
    }
  }
 const fields = {location: _Map,
                  dropdown: DropDown};
  
  
  //render(<App />, document.getElementById('root'));

class myForm extends React.Component {
    constructor(props)
    {
        super(props);
        let oo = props.objectInput;
        object_input = oo;
        converted_schema = schemaMaker(object_input);
        schema = converted_schema;

        // console.log("input  " ,input);
        this.state = {
            input_object: this.props.objectInput
        }
    }

    _onSubmit = ({formData}, e) => {
        // console.log("Data submitted: ",  formData);
        this.props.onSubmit(formData);
    } 


    render() {
        return (
            <Form 
            schema={schema}
            fields={fields} 
            onSubmit={this._onSubmit}
            uiSchema={uiSchema}
            />
        );
    }
}


export default myForm;