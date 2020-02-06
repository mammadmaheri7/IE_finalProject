// src/components/CatInputs.js
import React from "react"
const FieldInputs = (props) => {
  let fieldProps = {}
  fieldProps.required = props.required
  return (
    props.Fields.map((val, idx)=> {
      let catId = idx
      let out = (
        <div key={idx}>
          <div>
          <label htmlFor={catId}>name</label>
          </div>
          <div>
          <input {...props}
            type="text"
            name={catId}
            value={props.Fields[idx].name} 
            className="name"
            onChange={props.onChange}
          />
          </div>
          <div>
          <label htmlFor={catId}>title</label>
          </div>
          <div>
          <input {...props}
            type="text"
            name={catId}
            value={props.Fields[idx].title} 
            className="title"
            onChange={props.onChange}

          />
          </div>
         <div>
         <label htmlFor={catId}>type</label>
         </div>
          <input {...props}
            type="text"
            name={catId}
            value={props.Fields[idx].type} 
            className="type"
            onChange={props.onChange}

          />
          <div>
          <label htmlFor={catId}>required</label>
          </div>
          <div>
          <input {...props}
            type="text"
            name={catId}
            value={props.Fields[idx].required} 
            className="required"
            onChange={props.onChange}

          />
          </div>
       
          
        <button className="btn btn-link" 
        onClick={() => props.addOption(idx)}>
            Add Option
            </button>


        </div>
      )
      let options = <div></div>
      if(props.Fields[idx].options){
        options =  props.Fields[idx].options.map((val, option_id)=> {
            return (<ul>
              <li>
              <label htmlFor={option_id}>label</label>
              </li>
              <div>
              <input {...props}
            type="text"
            name={option_id}
            value={props.Fields[idx].options[option_id].label} 
            className="option_label"
            onChange={(e) => props.handleOptionChange(e,idx,option_id,"label")}

            />
              </div>
            <li>
            <label htmlFor={option_id}>value</label>
            </li>
            <div>
            <input {...props}
            type="text"
            name={option_id}
            value={props.Fields[idx].options[option_id].value} 
            className="option_value"
            onChange={(e) => props.handleOptionChange(e,idx,option_id,"value")}

            />
            </div>

            </ul>)
        })
    }

      out = <div>
          {out}
          {options}
      </div>
      return out
    })
  )
}
export default FieldInputs