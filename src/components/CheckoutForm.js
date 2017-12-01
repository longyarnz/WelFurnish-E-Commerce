import React, { Component } from 'react';
import DynamicForm from './DynamicForm';

export default class CheckoutForm extends Component {
 _onUpdate(){
    const { info } = this.props.actions;
    if(info !== ""){
      const { elements } = this;
      for(const input in elements) {
        const e = elements[input];
        if(e.nodeName === "INPUT" & !e.disabled || e.nodeName === "TEXTAREA" & !e.disabled) {
          e.value = info.customer[input];
        }
      }
    }
  }

  _onSubmit(e){
    e.preventDefault();
    let { cart, info } = this.props.actions;
    cart = cart.map(item => " " + item.title);
    cart = cart.toString().trim();
    const { checkout } = this.elements;
    const formValues = [];
    for(let i = 0; i < 5; i++) formValues.push(checkout[i].value);
    const check = formValues.every(value => value !== "");
    if(check ) {
      info = {
        customer : {
          _name: formValues[0],
          email: formValues[1],
          phone: parseInt(formValues[2], 0),
          address: formValues[3],
          city: formValues[4],
        },
        invoice : {
          invoice_number: 0,
          items: cart,
          cost: Math.floor(1.01 * this.props.actions.cost)
        }
      }
      const { _name, phone, address, city } = info.customer;
      console.log(info);
      this.props.actions.setInfo(info);
      this.props.actions.viewPrint();
      this.setState({ restore: { _name, phone, address, city } });
    }
  }

  _handleInput(e, type, ref){
    e.persist();
    const { target } = e;
    if (type === 'number' && ref === 'phone'){
      let value = parseInt(target.value.substr(0, 3), 0);
      value = value === 234 ? e.target.value : parseInt((234+""+target.value), 0);
      e.target.value = value;
    }
  }

  render() {
    const required = true;
    const { actions } = this.props;
    const options = [
			{ name: "input", divClassName: "checkout-form", type: "text", placeholder: "What is your name?", refName: "_name", required },
      { name: "input", divClassName: "checkout-form", type: "text", placeholder: "What is your email address?", refName: "email", required },
			{ 
        name: "input", divClassName: "checkout-form", type: "number", maxLength: 11, onChange: this._handleInput,
        placeholder: "What is your phone number (234××××××××××) ?", pattern: "[0-9]*", refName: "phone", required 
      },
			{ name: "textArea", divClassName: "checkout-form", type: "text", placeholder: "What is your delivery address?", refName: "address", required },
      { name: "input", divClassName: "checkout-form", type: "text", placeholder: "What is your city of delivery?", refName: "city", required },
			{ name: "button", divClassName: (actions.cost > 0 ? "checkout-form" : "no-display"), type: "button", refName: "back", button: "GO BACK", buttonClick: actions.viewCart }
		]
		const inline = { minHeight: actions.height + 20 }
  	return (
      <section className="checkout-form" style={ inline }>
        <section className="inner-pane">
        	<h1 className="checkout-form">CLIENT INFORMATION</h1>
        	<DynamicForm
            formData={options} 
            divClassName="checkout-form"
            button="CONTINUE TRANSACTION"
            formName="checkout"
            actions={actions} 
            onSubmit={this._onSubmit}
            onUpdate={this._onUpdate}
            onMount={this._onUpdate}
          />
        </section>
      </section>
    );
  }
}