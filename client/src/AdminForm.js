import React from "react"
import FieldInputs from "./FieldInputs"
class AdminForm extends React.Component {
  state = {
    Fields: [{name:"", title:"", type :"", required:""}],
    title: "",
    id: ""
  }
  
  addOption = (idx) =>{
    let Fields = [...this.state.Fields]
    if(Fields[idx].options === undefined)
        Fields[idx].options = []
    Fields[idx].options.push({label:"", value:""})
    this.setState({ Fields })


  }

  handleOptionChange = (e,idx,option_id,item) =>{
    let Fields = [...this.state.Fields]
    Fields[idx].options[option_id][item] = e.target.value;
    this.setState({ Fields })

  }
  
  onStaticChange = (e, feature) =>{
      this.setState({
        [feature] : e.target.value});
  }

  onChange = (e) =>{
    let Fields = [...this.state.Fields]
    console.log(Fields)
    Fields[e.target.name][e.target.className] = e.target.value;
    this.setState({ Fields })

    console.log(Fields)


  }

addCat = (e) => {
    this.setState((prevState) => ({
        Fields: [...prevState.Fields, {name:"", title:"", type :"", required:""}],
    }));
  }
handleSubmit = (e) => {
   e.preventDefault()
   if (this.props.onSubmit) this.props.onSubmit(this.state);
   }
render() {
    let {id, title, Fields} = this.state
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
          <div>
          <label className="form-control" htmlFor="id">id</label> 
          </div>
          <div>
          <input required = "true" onChange={e => {
                        this.onStaticChange(e, "id")
                      }} className="form-control" type="number" name="id" id="id" value={id} />
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
                       Fields={Fields} />
        <input  className="btn btn-primary mr-2" type="submit" value="Submit" /> 
      </form>
    )
  }
}
export default AdminForm

// const rootElement = document.getElementById("root");
// ReactDOM.render(<Form />, rootElement);