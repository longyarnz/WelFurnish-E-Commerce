import React, { Component } from 'react';
import SidePanel from './SidePanel';
import CartPanel from './CartPanel';
import CheckoutButton from './CheckoutButton';

export default class ShopArea extends Component {
  constructor(props) {
    super(props);
    this.actions = this.actions.bind(this);
  }

  actions(){
    const { actions } = this.props;
    return { actions }
  }

  render() {
    const actions = this.actions();
    return (
      <section className="shop-area">
      	<SidePanel actions={actions} />
        <CartPanel actions={actions} />
        <CheckoutButton actions={actions} />
      </section>
    );
  }
}