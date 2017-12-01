import React, { Component } from 'react';
import UUID from 'uuid';

export default class DynamicForm extends Component {
	constructor(props){
    super(props);
    this.elements = {};
    this._getRef = this._getRef.bind(this);
    this._onClick = this._onClick.bind(this);
    this.state = { restore: "" }
  }

  _getRef(ref){
  	if(ref !== null){
  		if(ref.nodeName === "FORM") { ref.enctype = "multipart/form-data"; ref.method = "post"; }
  		this.elements[ref.name] = ref;
  	}
  }

  componentDidMount() {
    if(this.props.onUpdate) this.props.onUpdate.call(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.onUpdate) this.props.onUpdate.call(this);
  }

  _handleInputs(input){
		if(!input.type) {
			console.error("DynamicForm inputs are not wrapped in an object");
			return;
		}

		const { 
			name, type='text', placeholder, autoComplete="off", button="", onChange=()=>{}, maxLength="",
			spellCheck=false, required=true, row=7, refName, options=[], buttonClick=(e)=>e.preventDefault(), min=0, title="",
			className, disabled=false, divClassName, autoFocus=false, multiple=false, pattern="[^~]*"
		} = input;

		if (name === 'input'){
			return(
				<div className={divClassName} key={UUID.v4()}>
					<input 
						type={type}
						className={divClassName} 
						ref={this._getRef}
						name={refName} 
						placeholder={placeholder} 
						required={required}
						autoComplete={autoComplete}
						autoFocus={autoFocus}
						spellCheck={spellCheck}
						disabled={disabled}
						onClick={this._onClick}
						onChange={e=>onChange.call(this, e, type, refName)}
						multiple={multiple}
						min={min}
						pattern={pattern}
						maxLength={maxLength}
						title={title}
					/>
				</div>
			)
		}
		else if(name === 'select'){
			return(
				<div className={divClassName} key={UUID.v4()}>
					<select className={className} ref={this._getRef} name={refName} defaultValue={options[0]}>
						{
							options.map((option, i)=>{
								return (
									<option key={i} value={option}>
										{option}
									</option>
								)
							})
						}
					</select>
				</div>
			)
		}
		else if(name === 'textArea'){
			return(
				<div className={divClassName} key={UUID.v4()}>
					<textarea 
						ref={this._getRef}
						name={refName} 
						placeholder={placeholder} 
						required={required}
						autoComplete={autoComplete}
						spellCheck={spellCheck}
						onClick={this._onClick}
						rows={row}
						className={divClassName}
						disabled={disabled} 
					/>
				</div>
			)
		}
		else if(name === 'button'){
			return(
				<div className={divClassName} key={UUID.v4()}>
					<button className={divClassName} onClick={e=>buttonClick.call(this, e)} name={refName} ref={this._getRef}>
						{button}
					</button>
				</div>
			)
		}
		else if(name === 'file'){
			return(
				<div className={divClassName} key={UUID.v4()}>
					<input 
						ref={this._getRef}
						name={refName} 
						placeholder={placeholder} 
						required={required}
						className={divClassName}
						disabled={disabled}
						multiple={multiple} 
					/>
				</div>
			)
		}
	}

	_onClick(e){
		if(e.which === 13) this.props.onSubmit.call(this, e);
	}

	render() {
		return (
      <form className={this.props.divClassName} onKeyPress={this._onClick} ref={this._getRef} name={this.props.formName} onSubmit={e=>this.props.onSubmit.call(this, e)}>
    		{
    			this.props.formData.map(data => {
    				return this._handleInputs(data);
    			})
    		}
    		<button className={this.props.divClassName} name={this.props.formName}>{this.props.button}</button>
    	</form>
    );
  }
}
