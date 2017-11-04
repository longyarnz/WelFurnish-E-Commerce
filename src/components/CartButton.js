import React from 'react';

export default function CartButton(props) {
  return (
    <button className="cart-button" onClick={props.onClick}>
      <span>VIEW CART <b>{props.number}</b></span>
    </button>
  );
}