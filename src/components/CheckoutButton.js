import React from 'react';

export default function CheckoutButton (props) {
	const { actions } = props.actions;
	const number = actions.cart.length > 0 ? actions.cart.length : 0;
	const className = `${actions.appView.nav} checkout-button`;
	return (
    <div className={className} onClick={actions.viewCart}>
      <span className="checkout-button">
        <i className="fa fa-cart-plus Checkout-button" />
        <span className="badge">{number}</span>
      </span>
    </div>
  );
}