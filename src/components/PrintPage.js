import React, { Component } from 'react';
import Logo from '../../src/files/logo.png';
import FetchGraph from './FetchGraph';

export default class PrintPage extends Component {
	constructor(props){
		super(props);
		this._onClick = this._onClick.bind(this);
		this._getOrder = this._getOrder.bind(this);
    this._getMetaData = this._getMetaData.bind(this);
    this._makePayment = this._makePayment.bind(this);
    this.state = { reference: "default", paystack: "pk_test_a44f1143bbcb989deb59b69c294804177cc03f9a" }
  }

  _getDate(due){
		const date = new Date();
		let year = date.getFullYear(),
		month = date.getMonth() + 1,
		day = date.getDate();
		if(arguments[0]){
			due = day + 1;
			date.setUTCDate(due);
			year = date.getFullYear();
			month = date.getMonth() + 1;
			day = date.getDate();
		}
		return `${day}/${month}/${year}`;
	}

	_getTime(){
		const date = new Date(),
		hours = date.getHours(),
		minutes = date.getMinutes();
		return `${hours} : ${minutes}`;
	}

	_getOrder(){
		const { cart, reNumber } = this.props.actions;
		const order = cart.map(item =>` ${item.title} (₦ ${reNumber(item.price)}  × ${item.qty}pcs)`);
		return order.toString().trim();
	}

  _getMetaData(){
    return {
      cartItems: this._getOrder(),
      invoice: this.props.actions.info.invoice.invoice_number,
      cost: this.props.actions.info.invoice.cost,
    }
  }

  _makePayment(){
    let { cost, info } = this.props.actions;
    const variables = {...info};
    cost = Math.floor(1.01 * cost);    
    info = JSON.parse(JSON.stringify(info));
    const query = `
      mutation RegularOrder($customer: UserInput!, $invoice: InvoiceInput!){
        MakeRegularOrder(client: $customer, invoice: $invoice){
          keyID
          invoice{
            invoice_number
          }
        }
      }
    `;
    FetchGraph(query, variables, null, ({ data }) => {
      this.setState({ reference: data.MakeRegularOrder.keyID });
      Object.assign(info.invoice, data.MakeRegularOrder.invoice);
      this.props.actions.setInfo(info);
      const paystack = window.PaystackPop.setup({
        key: this.state.paystack,
        email: info.customer.email,
        amount: cost * 100,
        ref: this.state.reference,
        metadata: this._getMetaData(),
        callback: res => console.log("Payment Completed"),
        onClose: () => console.log("Payment Closed"),
        currency: "NGN"
      });
      paystack.openIframe();
    });
  }

	_onClick(){
		const { actions } = this.props;
		actions.viewForm(actions.cost);
	}

  render() {
  	const { actions } = this.props;
  	const inline = { minHeight: actions.height + 20 }
  	const cost = Math.floor(1.01 * actions.cost);
    return (
      <section className={actions.appView.print + " print-page"} style={ inline }>
      	<section className="inner-pane">
      		<img src={Logo} alt="WelFurnish" />
        	<aside className="print-page left-pane no-display">
        		<h3 className="print-page">Account Name: WhoGoHost Limited</h3>
        		<h4 className="print-page">Account No/Bank: 0114023729 (GTBank)</h4>
        		<h4 className="print-page">Account No/Bank: 1013173318 (Zenith)</h4>
        		<h4 className="print-page">Account No/Bank: 0039691957 (Union)</h4>
        	</aside>
        	<header className="print-page">
        		<h3 className="print-page">Invoice #{actions.info.invoice.invoice_number}</h3>
						<h4 className="print-page">Invoice Date: {this._getDate()}</h4>
						<h4 className="print-page">Due Date: {this._getDate(1)}</h4>
        	</header>
        	<aside className="print-page left-pane">
        		<h3 className="print-page">Invoiced To:</h3>
        		<h4 className="print-page">{actions.info.customer._name},</h4>
            <h4 className="print-page">{actions.info.customer.email},</h4>
        		<h4 className="print-page">{actions.info.customer.phone},</h4>
        		<h4 className="print-page">{actions.info.customer.address},</h4>
        		<h4 className="print-page">{actions.info.customer.city}</h4>
        		<h4 className="print-page">Delivery Period: 24 hours after payment</h4>
        	</aside>
        	<div className="banner">UNPAID</div>
        	<main className="print-page">
        		<div>
        			<span>Description</span>
        			<span>Amount</span>
        		</div>
        		<div>
        			<span>{this._getOrder()}</span>
        			<span>₦ {actions.reNumber(actions.cost)}</span>
        		</div>
        		<div>
        			<span>1.00% VAT</span>
        			<span>₦ {actions.reNumber(Math.floor(0.01 * actions.cost))}</span>
        		</div>
        		<div>
        			<span>Credit</span>
        			<span>₦ 0</span>
        		</div>
        		<div>
        			<span>Total</span>
        			<span>₦ {actions.reNumber(cost)}</span>
        		</div>
        	</main>
        	<div className="center">
        		<button className="print-page" onClick={this._onClick}>GO BACK</button>
            <button className="print-page" onClick={this._makePayment}>MAKE PAYMENT</button>
            <button className="print-page" onClick={()=>actions.remove('all')}>CANCEL ORDER</button>
          </div>
        	<footer className="print-page">INVOICE GENERATED AT {this._getTime()}</footer>
        </section>
      </section>
    );
  }
}