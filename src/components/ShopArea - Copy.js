import React, { Component } from 'react';
import SidePanel from './SidePanel';
import CartPanel from './CartPanel';

export default class ShopArea extends Component {
  constructor(props) {
    super(props);
    this.actions = this.actions.bind(this);
    this._getHeight = this._getHeight.bind(this);
    this._custom = this._clickCustom.bind(this);
    this._clickCustomBack = this._clickCustomBack.bind(this)
    this._setFigure = this._setFigure.bind(this);
    this._setPrice = this._setPrice.bind(this);
    this.state = { custom: false, figure: "Show All", height: "auto", price: Infinity, update: true }
  }

  _getHeight(ShopArea){
    const height = ShopArea.clientHeight;
    this.setState({ height, update: true });
  }

  _clickCustom(){
    this.setState({ custom: true });
  }

  _clickCustomBack(){
    console.log(false);
    this.setState({ custom: false, update: true });
  }

  _setFigure(figure){
    this.setState({ custom: false, figure, update: true });
  }

  _setPrice(price){
    this.setState({ custom: false, price, update: true });
  }

  actions(){
    return {
      height: this.state.height,
      custom: this._clickCustom,
      customBack: this._clickCustomBack,
      customDisplay: this.state.custom,
      setFigure: this._setFigure,
      figure: this.state.figure,
      setPrice: this._setPrice,
      price: this.state.price,
      add: this.props.actions().add,
      remove: this.props.actions().remove,
      update: this.state.update,
      cartItems: this.props.actions().cartItems
    }
  }

  render() {
    const minHeight = window.innerHeight - 15 || document.documentElement.clientheight - 15 || document.body.clientheight - 15;
    const inline = { minHeight }
    return (
      <section className="shop-area" style={inline} ref={this._getHeight}>
      	<SidePanel viewCart={this.props.viewCart} clickCustom={()=>this._clickCustom()} figure={i=>this._setFigure(i)} price={i=>this._setPrice(i)} clickCustomBack={()=>this._clickCustomBack()} />
        <CartPanel actions={this.actions} />
      </section>
    );
  }
}
