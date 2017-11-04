import React, { Component } from 'react';

export default class CartInfoPane extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="cart-info">
      	<i className="" />
      	<span>{this.props.content}</span> 
      </div>
    );
  }
}
