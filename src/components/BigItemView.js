import React, { Component } from 'react';
import Image from './Image';
import Merge from './Merge';

export default class BigItemView extends Component {
	constructor(props) {
    super(props);
    this._click = this._click.bind(this);
    this._press = this._press.bind(this);
    this._change = this._change.bind(this);
    this._getRef = this._getRef.bind(this);
    this._clickBack = this._clickBack.bind(this);
    this.state = { 	qty: 0, cost: 0, text: "", clicked: false }
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.actions.item) return;
    const { prevOrder, cart, item } = nextProps.actions;
    const order = cart.findIndex(({ keyID })=>item.keyID === keyID);
    const qty = order > -1 ? prevOrder[order].qty : 1;
    const clicked = order > -1 ? true : false;
    this.textInput.value = clicked ? qty : "";
    this._change({ target: {value:qty}}, item.price);
    this.setState({ clicked });
  }

	_change(e, price){
    if(!arguments[1]) price = this.props.actions.item.price;
		const parse = parseInt(e.target.value, 0);
		const qty = isNaN(parse) || parse === 0 ? 1 : parse;
    const cost = this.props.actions.reNumber(parseInt(price, 0) * qty);
		const text = ` × ${qty} = ₦ ${cost}`;
    this.setState(e=>({ text, qty, cost })); 
	}

  _clickBack(){
    this.props.actions.clickBack();
  }

  _press(e){
    if(e.which === 13) this._click();
  }

  _click(){
    const { qty, clicked } = this.state;
    const item = Merge(this.props.actions.item, { qty });
    this.setState({ clicked: !clicked }); 
    if(clicked){
      this.props.actions.remove(this.props.actions.item); 
    }
    else{
      this.props.actions.add(item, qty, this.state.cost);  
    }
  }

  _getRef(ref){
    this.textInput = ref;
  }

  render() {
    if(!this.props.actions.item) return null;
  	const { src_file, title, description, price } = this.props.actions.item;
    const { reNumber } = this.props.actions;
    const newPrice = reNumber(price);
  	const _ = "Quantity To Order";
  	const sources = [ {src_file} ];
    const inline = { minHeight: window.clientHeight }
    const small = this.state.clicked;
    const button = small ? "REMOVE FROM CART" : "ADD TO CART";
    return (
      <section className={`big-view ${this.props.actions.visibility.big}`} style={inline}>
        <h1 className="big-view caption">{title}</h1>
        <span className="back" onClick={this.props.actions.clickBack}>GO BACK</span>
        <Image sources={sources} imgClass="gallery" />
      	<div>
      		<h1 className="big-view title">{title}<small className={small ? "show-tile" : "no-display"}>Added To Cart</small></h1>
          <small className={small ? "show-tile" : "remove-show-tile"}>ADDED TO CART</small>
      		<p>{description}</p>
      		<p><input className="big-view" onInput={e=>this._change(e, price)} onKeyPress={this._press} disabled={small} ref={this._getRef} min={1} placeholder={_} type="number" /></p>
      		<p>{"₦ " + newPrice + this.state.text}</p>
      	</div>
        <button className="big-view" onClick={this._click}>{button}</button>
        <button className="big-view" onClick={this._clickBack}>GO BACK</button>
      </section>
    );
  }
}
