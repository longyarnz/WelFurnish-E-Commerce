import React, { Component } from 'react';
import Image from './Image';
import Cycle from '../files/cycle.png';
import Repair from '../files/repair.png';
import Sales from '../files/sales.png';

export default class BigItemView extends Component {
	constructor(props) {
    super(props);
    this._click = this._click.bind(this);
    this.state = { 	qty: 0, cost: 0, text: "", clicked: false, input: {}, prevItems: [], prevOrder: [], order: 0 }
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    const { prevOrder, prevItems } = this.state;
    const order = prevItems.indexOf(nextProps.item);
    const qty = order > -1 ? prevOrder[order].qty : 1;
    const clicked = order > -1 ? true: false;
    this._change({ target: {value:qty}}, nextProps.actions().item.title, nextProps.actions().item.price);
    this.setState({ clicked, order });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.actions().update;
  }

	_change(e, product, price){
		const parse = parseInt(e.target.value, 0);
		const qty = isNaN(parse) ? 1 : parse;
    const cost = parseInt(price, 0) * qty;
		const text = ` ×   ${qty} = ₦ ${cost}`;
    this.setState(e=>({ text, qty, cost })); 
	}

  _click(){
    const { qty } = this.state;
    if(!this.state.clicked){        
      this.setState(e => ({ clicked: !e.clicked, prevItems: e.prevItems.concat(this.props.actions().item), prevOrder: e.prevOrder.concat({ qty }) }));
      this.props.actions().addStatus();
      this.props.actions().add(this.props.item, this.state.qty, this.state.cost);
    }
    else{
      console.log(this.props.actions().item);
      this.setState(e => {
        const { order, prevOrder, prevItems } = e;
        prevItems.splice(order, 1);
        prevOrder.splice(order, 1);
        return { clicked: !e.clicked, prevItems, prevOrder }
      });
      // this.props.actions().removeStatus();
      this.props.actions().remove(this.props.actions().item);
    }
  }

  render() {
  	const { src, title, desc, price } = this.props.actions().item;
  	const imgA = { src: src, alt: "Light Image" }
  	const imgB = { src: Cycle, alt: "Light Image" }
  	const imgC = { src: Repair, alt: "Light Image" }
  	const imgD = { src: Sales, alt: "Light Image" }
  	const sources = [ imgA, imgB, imgC, imgD ];
    const inline = { minHeight: this.props.actions().height };
    const button = !this.state.clicked ? "ADD TO CART" : "REMOVE FROM CART";
    const small = !this.state.clicked ? "no-display" : "";
    return (
      <section className={`big-view ${this.props.actions().visibility.big}`} style={inline}>
        <span className="back" onClick={this.props.actions().clickBack}>GO BACK</span>
        <Image sources={sources} imgClass="gallery" />
      	<div>
      		<h1 className="big-view">{title}<small className={small}>Added To Cart</small></h1>
      		<p>{desc}</p>
      		<p><input className="big-view" type="number" disabled={this.state.clicked} ref={input=>this.textInput = input} min={1} placeholder="Quantity To Order" onChange={e=>this._change(e, title, price)} /></p>
      		<p>{"₦ " + price + this.state.text}</p>
      	</div>
      	<button className="big-view" onClick={this._click}>{button}</button>
      </section>
    );
  }
}
