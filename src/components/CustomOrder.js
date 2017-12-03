import React, { Component } from 'react';
import DynamicForm from './DynamicForm';
import FetchGraph from './FetchGraph';

export default class CustomOrder extends Component {
	constructor(props){
		super(props);
		this._onClick = this._onClick.bind(this);
		this._setForm = this._setForm.bind(this);
		this.state = {
			button: <span>Upload picture samples <i>OPTIONAL</i></span>,
			name: "", submit: false
		}
	}

	_setForm(name, submit){
		this.setState({ name, submit });
	}

	_customButtonClick(e){
		e.preventDefault();
		this.elements.picture_file.click();
	}

	_buttonClick(e){
		e.preventDefault();
	}

	_onChange(e, type, name){
		if(type === 'file') {
			const files = e.target.files;
			const uploadedFiles = [];
			for(var x in files){
				if(Number(x) >= 0) {
					uploadedFiles.push(files[x].name);
					uploadedFiles.push("_ _");
				}
			}
			uploadedFiles.pop();
			this.elements.dispatch.textContent = uploadedFiles;
		}
	}

	_onClick(){
		this.setState({ name: "", submit: false });
		this.props.actions.clickBack();
	}

	_onSubmit(e){
		e.preventDefault();
		const { custom } = this.elements, customOrder = {}, formValues = {};
		let check = [], uploadables;
		for(let i = 0; i < 6; i++) formValues[custom[i].name] = custom[i].files ? custom[i].files[0] : custom[i].value;
		for(const x in formValues) {
			if(typeof formValues[x] === 'object') {
				uploadables = formValues[x];
				const prefix = Date.now().toString().slice(0, 8);
				formValues[x] = formValues[x].name !== "" ? `${prefix}_${formValues[x].name}` : null;	
				uploadables['alias'] = formValues[x];
			}
			customOrder[x] = formValues[x];
			check.push(formValues[x]);
			console.log(uploadables);
		}
		check = check.indexOf("") >= 0 ? false : true;
		if(check) {
			const query = `
			  mutation CustomOrder($customOrder: UserInput!){
			    CustomOrder(client: $customOrder){
			      _name
		        email
		        phone
		        city
		        picture_file
		        work_order
			    }
			  }
			`;
			this.props.setForm(formValues['_name'], true);
			FetchGraph(query, { customOrder }, uploadables, () => this.props.setForm(formValues['_name'], true));
			custom.reset();
		}
	}

	render() {
		const placeholder = "Describe IT (colour, height, size, etc.)";
		const { button, name, submit } = this.state;
		const status = submit ? "" : "no-display";
		const message = !submit ? "" : "no-display";
		const buttonClick = this._customButtonClick;
		const options = [
			{ name: "input", divClassName: "custom-order", type: "text", placeholder: "What is your name?", refName: "_name", buttonClick: this._buttonClick },
			{ name: "input", divClassName: "custom-order", type: "text", placeholder: "What is your email?", refName: "email", buttonClick: this._buttonClick },
			{ name: "input", divClassName: "custom-order", type: "number", placeholder: "What is your phone number (234××××××××××) ?", refName: "phone", buttonClick: this._buttonClick },
			{ name: "input", divClassName: "custom-order", type: "text", placeholder: "What is your city of delivery?", refName: "city", buttonClick: this._buttonClick },
			{ name: "textArea", divClassName: "custom-order", type: "text", placeholder: "Describe IT (colour, height, size, etc.)", refName: "work_order", buttonClick: this._buttonClick, spellCheck: true },
			{ name: "input", divClassName: "custom-order", type: "file", onChange: this._onChange, placeholder, refName: "picture_file", required: false, multiple: false, buttonClick: this._buttonClick },
			{ name: "button", divClassName: "proxy", type: "text", refName: "dispatch", button, buttonClick },
			{ name: "button", divClassName: "big-view custom-order", type: "text", button: "GO BACK", refName: "back", buttonClick: this.props.actions.clickBack }
		]
  	return (
      <section className="big-view custom">
      	<h1 className={message + " big-view custom-order"}>MAKE A CUSTOM ORDER</h1>
      	<DynamicForm formData={options} divClassName={message + " custom-order"} button="CREATE ORDER" formName="custom" setForm={this._setForm} onSubmit={this._onSubmit} />
    		<h1 className={status + " big-view"}>ORDER COMPLETED</h1>
      	<p className={status + " form-message"}>
      		Thank you very much <span className="form-message">{name}</span>. We have received your order. 
      		We shall contact you shortly for a price quotation and work duration.
      		<i className="fa fa-check-circle" />
      		<button className="custom-order" onClick={()=>this._setForm("", false)}>
						GO BACK
					</button>
      	</p>
      </section>
    );
  }
}