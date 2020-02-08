import React from "react"
import FieldInputs from "./FieldInputs"
class AdminForm extends React.Component {
  state = {
    fields: [{name:"", title:"", type :"", required:""}],
    title: ""
  }
  
  addOption = (idx) =>{
    let fields = [...this.state.fields]
    if(fields[idx].options === undefined){
      fields[idx].options = []
    }
    if(fields[idx].type === "Location"){
      let newOption = {}
      newOption.label = ""
      newOption.value = {}
      newOption.value.lat = ""
      newOption.value.long = ""
      fields[idx].options.push(newOption)
    }else{
      fields[idx].options.push({label:"", value:""})
    }
    this.setState({ fields })


  }


  handleOptionChange = (e,idx,option_id,item) =>{
    let fields = [...this.state.fields]
    if(fields[idx].type === "Location" && (item ==="lat" || item === "long"))
      fields[idx].options[option_id].value[item] = e.target.value
    else
      fields[idx].options[option_id][item] = e.target.value;

    // if(fields[idx].type === "Location" && item === "value"){
    //   try{
    //     fields[idx].options[option_id][item] = JSON.parse(e.target.value);
    //   }catch(e){
    //   }
    // }
    this.setState({ fields })

  }
  
  onStaticChange = (e, feature) =>{
      this.setState({
        [feature] : e.target.value});
  }

  onChange = (e) =>{
    let fields = [...this.state.fields]
   // console.log(fields)
    fields[e.target.name][e.target.className] = e.target.value;
    if(e.target.className === "required"){
      let val = e.target.value === "true" ? true : false;
    fields[e.target.name][e.target.className] = val;
    }
    if(e.target.className === "type"){
      fields[e.target.name].options = undefined;
    }
    this.setState({ fields })

    //console.log(fields)


  }

addCat = (e) => {
    this.setState((prevState) => ({
      fields: [...prevState.fields, {name:"", title:"", type :"", required:""}],
    }));
  }
handleSubmit = (e) => {
   e.preventDefault()
   console.log(this.state)
   if (this.props.onSubmit) this.props.onSubmit(this.state);
   }
render() {
    let {title, fields} = this.state
    return (
      <form 
      className="dynamic-form"
      onSubmit={this.handleSubmit}  >
          <div>
          <label className="form-control" htmlFor="title">Title</label> 
          </div>
          <div>
          <input required = "true" onChange={e => {
                        this.onStaticChange(e, "title")
                      }}
                      className="form-control" type="text" name="title" id="title" value={title} />
          </div>

        <button className="btn btn-link" onClick={this.addCat}>Add new Field</button>
        <FieldInputs required = "true"
                    onChange={e => {
                        this.onChange(e);
                      }}
                      handleOptionChange={ (e,idx,option_id,item) => {
                        this.handleOptionChange(e,idx,option_id,item);
                      }}
                      addOption={e => {
                        this.addOption(e);
                      }}
                      fields={fields} />
        <input  className="btn btn-primary mr-2" type="submit" value="Submit" /> 
      </form>
    )
  }
}
export default AdminForm

// const rootElement = document.getElementById("root");
// ReactDOM.render(<Form />, rootElement);