import React, { Component } from 'react';
import CheckoutPane from './CheckoutPane';

export default class CheckoutPanel extends Component {
  render() {
    const { actions } = this.props;
    const inline = { minHeight: actions.height + 20 };
    let total = 0, click = null;
    return (
      <section className={actions.appView.panel + " checkout-panel"} style={inline}>
        <section className="inner-pane">
          <h1 className="checkout-panel">SHOPPING CART</h1>
          <div>
            <aside className="checkout left-checkout caption">
              <div><h3 className="checkout-panel">Products and Description</h3></div>
            </aside>
            <aside className="checkout right-checkout caption colored">
              <div><h3 className="checkout-panel">Price (₦)</h3></div>
            </aside>
            <aside className="checkout right-checkout final-checkout">
              <div></div>
            </aside>
          </div>
          {
            actions.cart.map((item, i)=>{
              total += item.price * item.qty;
              click = total > 0 ? (()=>actions.viewForm(total)) : null;
              return <CheckoutPane item={item} reNumber={actions.reNumber} remove={actions.remove} key={item.realID} />
            })
          }
          <div>
            <aside className="checkout left-checkout caption">
              <div><h3 className="checkout-panel">Total</h3></div>
            </aside>
            <aside className="checkout right-checkout colored">
              <div><h3 className="checkout-panel">₦ {actions.reNumber(total)}</h3></div>
            </aside>
            <aside className="checkout right-checkout final-checkout">
              <div></div>
            </aside>
          </div>
          <button className="big-view checkout" onClick={actions.viewShop}>GO BACK</button>
          <button className={click === null ? "no-display" : "big-view checkout"} onClick={click}>CHECKOUT</button>
        </section>
      </section>
    );
  }
}