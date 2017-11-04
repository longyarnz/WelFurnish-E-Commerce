import React, { Component } from 'react';

export default class CheckoutPane extends Component {
  constructor(props){
    super(props);
    this._click = this._click.bind(this);
    this.state = { pane: "pane", mount: true }
  }

  _click(){
    this.setState({pane: "delete-node"});
    setTimeout(()=>this.props.remove(this.props.item), 800);
  }

  render(){
    const { item, reNumber } = this.props;
    return !this.state.mount ? null : (
      <div className={this.state.pane}>
        <aside className="checkout left-checkout">
          <div>{item.title}</div>
          <div>₦ {reNumber(item.price)} &times; {item.qty}pcs</div>
        </aside>
        <aside className="checkout right-checkout">
          <div>₦ {reNumber(item.price * item.qty)}</div>
        </aside>  
        <aside className="checkout right-checkout final-checkout" onClick={this._click}>
          <div><i className="fa fa-times-circle" /></div>
        </aside>
      </div>
    )
  }
}
